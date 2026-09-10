import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import request from "supertest";

process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

// Two recent days: first carries verified demographics, second does not
// (mirrors the post-2025-10-07 upstream gap — CSV must emit blank cells).
const SEED_DAYS = [
  {
    report_date: isoDaysAgo(1),
    report_period: 66,
    killed_cum: 72850,
    killed_children_cum: 19980,
    injured_cum: 173800,
  },
  {
    report_date: isoDaysAgo(0),
    report_period: 67,
    killed_cum: 73000,
    injured_cum: 174000,
  },
];

vi.mock(
  "../infrastructure/repositories/PrismaStatisticRepository.js",
  () => ({
    PrismaStatisticRepository: class {
      async upsertMetric() {}
      async getLatest() {
        return null;
      }
      async getHistory(
        _region: string,
        startDate: string,
        endDate: string,
        offset: number,
        limit: number,
      ) {
        return SEED_DAYS.filter(
          (d) => d.report_date >= startDate && d.report_date <= endDate,
        )
          .slice(offset, offset + limit)
          .map((d) => ({
            reportDate: d.report_date,
            reportPeriod: d.report_period,
            metrics: {
              killed_cum: d.killed_cum,
              injured_cum: d.injured_cum,
              ...("killed_children_cum" in d
                ? {
                    killed_children_cum: (
                      d as { killed_children_cum?: number }
                    ).killed_children_cum,
                  }
                : {}),
              _report_period: d.report_period,
              _report_source: 0,
            },
          }));
      }
      async countHistoryDates(
        _region: string,
        startDate: string,
        endDate: string,
      ) {
        return SEED_DAYS.filter(
          (d) => d.report_date >= startDate && d.report_date <= endDate,
        ).length;
      }
    },
  }),
);

beforeEach(() => {
  import("./statisticsController.js").then((m) => {
    m.cachedStats.clear();
    m.cachedWestBankStats.clear();
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("statistics export endpoint", () => {
  it("GET /export?format=csv returns raw attachment with fixed columns", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      `/api/v1/statistics/export?startDate=${SEED_DAYS[0].report_date}&endDate=${SEED_DAYS[1].report_date}&format=csv`,
    );

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.headers["content-disposition"]).toContain("attachment;");
    expect(res.headers["content-disposition"]).toContain(
      `gaza-history-${SEED_DAYS[0].report_date}-to-${SEED_DAYS[1].report_date}.csv`,
    );
    expect(res.headers["cache-control"]).toContain("no-store");

    const lines = String(res.text).trim().split("\n");
    expect(lines).toHaveLength(3);
    const header = lines[0].split(",");
    // report_date first, then report_period, then canonical metric order
    expect(header[0]).toBe("report_date");
    expect(header[1]).toBe("report_period");
    expect(header).toContain("killed_cum");
    expect(header).toContain("injured_cum");
    expect(header).toContain("killed_children_cum");
    // No internal bookkeeping columns leak into the header
    expect(header.some((c) => c.startsWith("_"))).toBe(false);

    const killedIdx = header.indexOf("killed_cum");
    const childrenIdx = header.indexOf("killed_children_cum");
    const firstRow = lines[1].split(",");
    expect(firstRow[0]).toBe(SEED_DAYS[0].report_date);
    expect(firstRow[killedIdx]).toBe("72850");
    expect(firstRow[childrenIdx]).toBe("19980");
    // Second day has no demographics — blank cell, same column count
    const secondRow = lines[2].split(",");
    expect(secondRow[0]).toBe(SEED_DAYS[1].report_date);
    expect(secondRow).toHaveLength(header.length);
    expect(secondRow[childrenIdx]).toBe("");
  });

  it("GET /export?format=json returns the plain items array (no envelope)", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      `/api/v1/statistics/export?startDate=${SEED_DAYS[0].report_date}&endDate=${SEED_DAYS[1].report_date}&format=json`,
    );

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(res.headers["content-disposition"]).toContain("attachment;");
    expect(res.headers["content-disposition"]).toContain(".json");
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].report_date).toBe(SEED_DAYS[0].report_date);
    expect(res.body[0].killed_cum).toBe(72850);
    // Envelope keys are never present on the raw download
    expect(res.body.success).toBeUndefined();
    expect(res.body.data).toBeUndefined();
    // Internal bookkeeping keys are never exposed
    expect(res.body[0]._report_period).toBeUndefined();
  });

  it("defaults to csv when format is omitted", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      `/api/v1/statistics/export?startDate=${SEED_DAYS[0].report_date}&endDate=${SEED_DAYS[1].report_date}`,
    );

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
  });

  it("returns 400 VALIDATION_ERROR envelope on bad format", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      "/api/v1/statistics/export?format=xml",
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 VALIDATION_ERROR envelope when startDate is after endDate", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      `/api/v1/statistics/export?startDate=${SEED_DAYS[1].report_date}&endDate=${SEED_DAYS[0].report_date}&format=csv`,
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns a header-only CSV for a window with no data", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      "/api/v1/statistics/export?startDate=2020-01-01&endDate=2020-01-31&format=csv",
    );

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    const lines = String(res.text).trim().split("\n");
    expect(lines).toHaveLength(1);
    expect(lines[0].split(",")[0]).toBe("report_date");
  });
});
