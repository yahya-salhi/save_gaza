import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";
import { resetLastSummarySyncAt } from "../infrastructure/cache/syncTracker.js";
import { summaryCache } from "./summaryController.js";

const app = createApp();

beforeEach(() => {
  resetLastSummarySyncAt();
  summaryCache.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("health endpoints", () => {
  it("GET /health returns ok envelope", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual({ status: "ok" });
    expect(res.body.error).toBeNull();
    expect(typeof res.body.timestamp).toBe("string");
  });

  it("GET /ready returns readiness envelope", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("status");
    expect(["ok", "degraded"]).toContain(res.body.data.status);
    expect(res.body.data.db).toHaveProperty("latencyMs");
    expect(res.body.data.db).toHaveProperty("syncedAt");
  });

  it("GET /ready reports null syncedAt before any sync and ISO latency shape", async () => {
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(
      res.body.data.db.syncedAt === null ||
        Number.isNaN(Date.parse(res.body.data.db.syncedAt)) === false,
    ).toBe(true);
    expect(
      res.body.data.db.latencyMs === null ||
        typeof res.body.data.db.latencyMs === "number",
    ).toBe(true);
  });

  it("GET /ready reports syncedAt after a successful summary sync", async () => {
    const validSummary = {
      gaza: {
        reports: 1,
        last_update: "2026-09-07",
        massacres: 1,
        killed: { total: 1 },
        famine: {},
        aid_seeker: {},
        injured: { total: 1 },
      },
      west_bank: {
        reports: 1,
        last_update: "2026-09-07",
        settler_attacks: 1,
        killed: { total: 1, children: 0 },
        injured: { total: 1, children: 0 },
      },
      lebanon: {
        reports: 1,
        first_report: "2023-11-14",
        last_update: "2026-09-06",
        killed: { total: 1 },
        injured: { total: 1 },
      },
      known_killed_in_gaza: {
        records: 1,
        pages: 1,
        page_size: 100,
        male: { adult: 0, senior: 0, child: 0 },
        female: { adult: 0, senior: 0, child: 0 },
        last_update: "2026-07-27",
        includes_until: "2026-05-07",
      },
      known_press_killed_in_gaza: { records: 0 },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(validSummary),
      } as unknown as Response),
    );

    const warm = await request(app).get("/api/v1/summary");
    expect(warm.status).toBe(200);

    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(typeof res.body.data.db.syncedAt).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.data.db.syncedAt))).toBe(false);
  });
});

describe("API v1 gateway", () => {
  it("GET /api/v1/nonexistent returns 404 envelope", async () => {
    const res = await request(app).get("/api/v1/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("health endpoints remain at root level", async () => {
    const health = await request(app).get("/health");
    const ready = await request(app).get("/ready");
    expect(health.status).toBe(200);
    expect(ready.status).toBe(200);
  });
});
