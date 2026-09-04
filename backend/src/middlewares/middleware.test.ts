import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../app.js";

const app = createApp();

describe("rate limiter", () => {
  it("allows requests within limit", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.headers["ratelimit-remaining"]).toBeDefined();
  });

  it("returns rate limit headers", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["ratelimit-limit"]).toBeDefined();
    expect(res.headers["ratelimit-policy"]).toBeDefined();
  });
});

describe("helmet CSP", () => {
  it("sets Content-Security-Policy header", async () => {
    const res = await request(app).get("/health");
    expect(res.headers["content-security-policy"]).toBeDefined();
  });

  it("allows Google Fonts in CSP", async () => {
    const res = await request(app).get("/health");
    const csp = res.headers["content-security-policy"];
    expect(csp).toContain("fonts.googleapis.com");
    expect(csp).toContain("fonts.gstatic.com");
  });

  it("allows OpenStreetMap tiles", async () => {
    const res = await request(app).get("/health");
    const csp = res.headers["content-security-policy"];
    expect(csp).toContain("tile.openstreetmap.org");
  });

  it("blocks frame embedding", async () => {
    const res = await request(app).get("/health");
    const csp = res.headers["content-security-policy"];
    expect(csp).toContain("frame-src 'none'");
  });
});

describe("CORS", () => {
  it("sets CORS origin from config", async () => {
    const res = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:5173");
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });
});
