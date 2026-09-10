import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { regionsCache } from "./spatialController.js";

describe("spatial regions endpoint", () => {
  beforeEach(() => {
    regionsCache.clear();
  });

  it("GET /api/v1/spatial/regions/gaza returns identity metadata in envelope", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/spatial/regions/gaza");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data).toMatchObject({
      id: "gaza",
      name: "Gaza",
      sortOrder: 1,
      position: 2,
    });
    const [lng, lat] = res.body.data.centroid;
    expect(typeof lng).toBe("number");
    expect(typeof lat).toBe("number");
    expect(lng).toBeGreaterThan(34.2);
    expect(lng).toBeLessThan(34.6);
    expect(lat).toBeGreaterThan(31.2);
    expect(lat).toBeLessThan(31.6);
    const [minLng, minLat, maxLng, maxLat] = res.body.data.bbox;
    expect(minLng).toBeLessThan(maxLng);
    expect(minLat).toBeLessThan(maxLat);
    // Identity only — never per-region casualty figures
    expect(res.body.data).not.toHaveProperty("killed");
    expect(res.body.data).not.toHaveProperty("damage");
    expect(typeof res.body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });

  it("serves the curated pre-war overview for every governorate", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const expected: Record<string, { areaKm2: number; population2017: number; adminCentre: string }> = {
      "north-gaza": { areaKm2: 60.9, population2017: 368978, adminCentre: "Jabalia" },
      gaza: { areaKm2: 74.6, population2017: 652597, adminCentre: "Gaza City" },
      "deir-al-balah": { areaKm2: 56.7, population2017: 273200, adminCentre: "Deir al-Balah" },
      "khan-younis": { areaKm2: 109.7, population2017: 370638, adminCentre: "Khan Younis" },
      rafah: { areaKm2: 63.1, population2017: 233878, adminCentre: "Rafah" },
    };
    for (const [id, overview] of Object.entries(expected)) {
      const res = await request(app).get(`/api/v1/spatial/regions/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject(overview);
      expect(res.body.data.overviewSource).toMatch(/pre-war/);
      expect(res.body.data.localities.length).toBeGreaterThan(0);
      expect(typeof res.body.data.blurb).toBe("string");
    }
  });

  it("resolves all five governorate ids north to south", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const ids = ["north-gaza", "gaza", "deir-al-balah", "khan-younis", "rafah"];
    for (const [index, id] of ids.entries()) {
      const res = await request(app).get(`/api/v1/spatial/regions/${id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(id);
      expect(res.body.data.sortOrder).toBe(index);
      expect(res.body.data.position).toBe(index + 1);
    }
  });

  it("returns 404 NOT_FOUND envelope for an unknown id", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/spatial/regions/west-bank");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });

  it("sets long-lived public Cache-Control and Vary headers", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const res = await request(app).get("/api/v1/spatial/regions/rafah");
    expect(res.headers["cache-control"]).toBe("public, max-age=86400");
    expect(res.headers["vary"]).toContain("Accept-Encoding");
  });

  it("serves identical payload from cache on second request", async () => {
    const { createApp } = await import("../app.js");
    const app = createApp();

    const first = await request(app).get("/api/v1/spatial/regions/khan-younis");
    const second = await request(app).get(
      "/api/v1/spatial/regions/khan-younis",
    );
    expect(second.status).toBe(200);
    expect(second.body.data).toEqual(first.body.data);
  });
});
