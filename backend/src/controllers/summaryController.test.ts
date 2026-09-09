import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import request from "supertest";
import { summaryCache } from "./summaryController.js";

const validSummary = {
  gaza: {
    reports: 1067,
    last_update: "2026-09-07",
    massacres: 12000,
    killed: {
      total: 73658,
      children: 20179,
      women: 12500,
      civil_defence: 140,
      press: 262,
      medical: 1701,
    },
    famine: {},
    aid_seeker: {},
    injured: { total: 174622 },
  },
  west_bank: {
    reports: 1067,
    last_update: "2026-09-07",
    settler_attacks: 4554,
    killed: { total: 1114, children: 238 },
    injured: { total: 11625, children: 1913 },
  },
  lebanon: {
    reports: 193,
    first_report: "2023-11-14",
    last_update: "2026-09-06",
    killed: { total: 8409 },
    injured: { total: 29016 },
  },
  known_killed_in_gaza: {
    records: 72835,
    pages: 729,
    page_size: 100,
    male: { adult: 36067, senior: 2089, child: 12803 },
    female: { adult: 11733, senior: 1309, child: 8834 },
    last_update: "2026-07-27",
    includes_until: "2026-05-07",
  },
  known_press_killed_in_gaza: { records: 262 },
};

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

beforeEach(() => {
  summaryCache.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("summary endpoint", () => {
  it("GET /api/v1/summary returns the validated summary in the envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(validSummary)));

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/summary");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data.gaza.killed.total).toBe(73658);
    expect(res.body.data.west_bank.settler_attacks).toBe(4554);
    expect(res.body.data.known_press_killed_in_gaza.records).toBe(262);
  });

  it("returns 502 when the upstream feed fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/summary");
    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("EXTERNAL_API_ERROR");
  });

  it("returns a valid 200 envelope with timestamp (Slice 2.3)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(validSummary)));

    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/summary");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data).toBeDefined();
    expect(typeof res.body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });

  it("serves stale cache with 200 when upstream fails after a warm response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(validSummary)));

    const { createApp } = await import("../app.js");
    const app = createApp();

    const warm = await request(app).get("/api/v1/summary");
    expect(warm.status).toBe(200);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const stale = await request(app).get("/api/v1/summary");
    expect(stale.status).toBe(200);
    expect(stale.body.success).toBe(true);
    expect(stale.body.data.gaza.killed.total).toBe(73658);
  });
});
