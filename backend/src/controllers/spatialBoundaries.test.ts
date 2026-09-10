import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { boundariesCache } from "./spatialController.js";

describe("spatial boundaries endpoint", () => {
  beforeEach(() => {
    boundariesCache.clear();
  });

  it("GET /api/v1/spatial/boundaries returns 5 Gaza governorates in envelope", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/spatial/boundaries");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data.type).toBe("FeatureCollection");
    expect(res.body.data.features).toHaveLength(5);
    expect(res.body.data.features.map((f: { id: string }) => f.id)).toEqual([
      "north-gaza",
      "gaza",
      "deir-al-balah",
      "khan-younis",
      "rafah",
    ]);
    expect(typeof res.body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });

  it("sets long-lived public Cache-Control and Vary headers", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/spatial/boundaries");
    expect(res.headers["cache-control"]).toBe("public, max-age=86400");
    expect(res.headers["vary"]).toContain("Accept-Encoding");
  });

  it("serves identical payload from cache on second request", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const first = await request(app).get("/api/v1/spatial/boundaries");
    const second = await request(app).get("/api/v1/spatial/boundaries");
    expect(second.status).toBe(200);
    expect(second.body.data).toEqual(first.body.data);
  });

  it("gzip-encodes when the client accepts gzip", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app)
      .get("/api/v1/spatial/boundaries")
      .set("Accept-Encoding", "gzip");
    expect(res.status).toBe(200);
    expect(res.headers["content-encoding"]).toBe("gzip");
    // superagent transparently decompresses — body stays usable
    expect(res.body.success).toBe(true);
    expect(res.body.data.features).toHaveLength(5);
  });
});
