import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

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
