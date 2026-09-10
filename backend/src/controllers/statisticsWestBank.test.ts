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

const validWestBankDaily = [
  {
    report_date: "2026-09-09",
    flash_source: "fill",
    killed_cum: 1114,
    killed_children_cum: 238,
    injured_cum: 11625,
    injured_children_cum: 1913,
    settler_attacks_cum: 4554,
    displaced_households_cum: 1423,
    displaced_persons_cum: 9553,
    displaced_children_cum: 3963,
  },
  {
    report_date: "2026-09-08",
    flash_source: "fill",
    killed_cum: 1110,
    injured_cum: 11600,
    settler_attacks_cum: 4540,
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
  import("./statisticsController.js").then((m) => m.cachedWestBankStats.clear());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("west-bank statistics endpoint", () => {
  it("GET /api/v1/statistics/west-bank returns validated data in envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validWestBankDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/west-bank");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data.report_date).toBe("2026-09-09");
    expect(res.body.data.killed_cum).toBe(1114);
    expect(res.body.data.settler_attacks_cum).toBe(4554);
    expect(res.body.data.displaced_persons_cum).toBe(9553);
    expect(res.body.data.flash_source).toBe("fill");
  });

  it("returns latest report_date when multiple rows exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validWestBankDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/west-bank");
    expect(res.status).toBe(200);
    expect(res.body.data.report_date).toBe("2026-09-09");
    expect(res.body.data.killed_cum).toBe(1114);
  });

  it("returns 502 when the upstream feed fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/west-bank");
    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("EXTERNAL_API_ERROR");
  });

  it("serves stale cache with 200 when upstream fails after warm response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validWestBankDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const warm = await request(app).get("/api/v1/statistics/west-bank");
    expect(warm.status).toBe(200);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const stale = await request(app).get("/api/v1/statistics/west-bank");
    expect(stale.status).toBe(200);
    expect(stale.body.success).toBe(true);
    expect(stale.body.data.killed_cum).toBe(1114);
  });

  it("returns valid envelope with ISO timestamp", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(validWestBankDaily)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/statistics/west-bank");
    expect(res.status).toBe(200);
    expect(typeof res.body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });
});
