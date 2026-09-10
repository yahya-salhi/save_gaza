import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import request from "supertest";

process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

// Three consecutive recent days — always inside the trailing-90d default.
const SEED_DAYS = [
  { report_date: isoDaysAgo(2), report_period: 65, killed_cum: 72800, injured_cum: 173700 },
  { report_date: isoDaysAgo(1), report_period: 66, killed_cum: 72850, injured_cum: 173800 },
  { report_date: isoDaysAgo(0), report_period: 67, killed_cum: 73000, injured_cum: 174000 },
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

describe("statistics history endpoint", () => {
  it("GET /history with explicit range returns paginated items in envelope", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      `/api/v1/statistics/history?startDate=${SEED_DAYS[0].report_date}&endDate=${SEED_DAYS[2].report_date}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data.page).toBe(1);
    expect(res.body.data.limit).toBe(100);
    expect(res.body.data.total).toBe(3);
    expect(res.body.data.items).toHaveLength(3);
    // Ascending order, full daily shape
    expect(res.body.data.items[0].report_date).toBe(SEED_DAYS[0].report_date);
    expect(res.body.data.items[2].report_date).toBe(SEED_DAYS[2].report_date);
    expect(res.body.data.items[2].killed_cum).toBe(73000);
    expect(res.body.data.items[2].report_period).toBe(67);
    // Internal bookkeeping keys are never exposed
    expect(res.body.data.items[0]._report_period).toBeUndefined();
    expect(res.body.data.items[0]._report_source).toBeUndefined();
    expect(typeof res.body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });

  it("GET /history with no params defaults to trailing 90 days", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/history");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(3);
    expect(res.body.data.items).toHaveLength(3);
  });

  it("paginates distinct dates with page/limit", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      `/api/v1/statistics/history?startDate=${SEED_DAYS[0].report_date}&endDate=${SEED_DAYS[2].report_date}&page=2&limit=1`,
    );

    expect(res.status).toBe(200);
    expect(res.body.data.page).toBe(2);
    expect(res.body.data.limit).toBe(1);
    expect(res.body.data.total).toBe(3);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].report_date).toBe(SEED_DAYS[1].report_date);
  });

  it("returns 400 VALIDATION_ERROR on malformed date", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      "/api/v1/statistics/history?startDate=not-a-date",
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 VALIDATION_ERROR when startDate is after endDate", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      `/api/v1/statistics/history?startDate=${SEED_DAYS[2].report_date}&endDate=${SEED_DAYS[0].report_date}`,
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns empty items with total 0 for a window with no data", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get(
      "/api/v1/statistics/history?startDate=2020-01-01&endDate=2020-01-31",
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toEqual([]);
    expect(res.body.data.total).toBe(0);
  });
});
