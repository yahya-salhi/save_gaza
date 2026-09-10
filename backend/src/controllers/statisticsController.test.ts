import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import request from "supertest";

process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

const store = new Map<string, { label: string; value: number }>();

vi.mock(
  "../infrastructure/repositories/PrismaStatisticRepository.js",
  () => ({
    PrismaStatisticRepository: class {
      async upsertMetric(
        region: string,
        reportDate: string,
        type: string,
        label: string,
        value: number,
      ) {
        store.set(`${region}:${reportDate}:${type}`, { label, value });
      }
      async getLatest(region: string) {
        let latestDate = "";
        for (const key of store.keys()) {
          const [, date] = key.split(":");
          if (date > latestDate) latestDate = date;
        }
        if (!latestDate) return null;
        const metrics: Record<string, number> = {};
        for (const [key, entry] of store.entries()) {
          const [r, d, type] = key.split(":");
          if (r === region && d === latestDate) metrics[type] = entry.value;
        }
        return { reportDate: latestDate, metrics };
      }
    },
  }),
);

const validCasualtiesDaily = [
  {
    report_date: "2026-09-09",
    report_source: "MoH",
    report_period: 68,
    massacres_cum: 2000,
    killed: 150,
    killed_cum: 73000,
    killed_children_cum: 20000,
    killed_women_cum: 12000,
    killed_recovered: 50,
    killed_succumbed: 10,
    killed_truce_new: 200,
    killed_committee: 500,
    child_famine_cum: 500,
    famine_cum: 800,
    aid_seeker_killed_cum: 400,
    aid_seeker_injured_cum: 1500,
    injured: 200,
    injured_cum: 174000,
    civdef_killed_cum: 140,
    med_killed_cum: 1700,
    press_killed_cum: 260,
  },
  {
    report_date: "2026-09-08",
    report_source: "MoH",
    report_period: 67,
    killed_cum: 72850,
    injured_cum: 173800,
    press_killed_cum: 259,
  },
];

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

beforeEach(() => {
  store.clear();
  // Clear the cached stats before each test
  import("./statisticsController.js").then((m) => m.cachedStats.clear());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("statistics endpoint", () => {
  it("GET /api/v1/statistics/gaza returns validated data in envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validCasualtiesDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/gaza");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data.report_date).toBe("2026-09-09");
    expect(res.body.data.killed_cum).toBe(73000);
    expect(res.body.data.press_killed_cum).toBe(260);
    expect(res.body.data.report_source).toBe("MoH");
    expect(res.body.data.report_period).toBe(68);
  });

  it("returns latest report_date when multiple rows exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validCasualtiesDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/gaza");
    expect(res.status).toBe(200);
    expect(res.body.data.report_date).toBe("2026-09-09");
    expect(res.body.data.killed_cum).toBe(73000);
  });

  it("returns 502 when the upstream feed fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/gaza");
    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("EXTERNAL_API_ERROR");
  });

  it("serves stale cache with 200 when upstream fails after warm response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validCasualtiesDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const warm = await request(app).get("/api/v1/statistics/gaza");
    expect(warm.status).toBe(200);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const stale = await request(app).get("/api/v1/statistics/gaza");
    expect(stale.status).toBe(200);
    expect(stale.body.success).toBe(true);
    expect(stale.body.data.killed_cum).toBe(73000);
  });

  it("returns valid envelope with ISO timestamp", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validCasualtiesDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/gaza");
    expect(res.status).toBe(200);
    expect(typeof res.body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });
});
