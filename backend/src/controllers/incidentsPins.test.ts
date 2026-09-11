import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { pinsCache } from "./incidentsController.js";

process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";

type PinRow = {
  id: string;
  title: string;
  reportDate: string;
  region: string;
  latitude: number;
  longitude: number;
};

let pinRows: PinRow[] = [];

vi.mock(
  "../infrastructure/repositories/PrismaIncidentRepository.js",
  () => ({
    PrismaIncidentRepository: class {
      async getApprovedPins(bbox?: [number, number, number, number]) {
        const rows = bbox
          ? pinRows.filter(
              (p) =>
                p.longitude >= bbox[0] &&
                p.longitude <= bbox[2] &&
                p.latitude >= bbox[1] &&
                p.latitude <= bbox[3],
            )
          : [...pinRows];
        return rows.slice(0, 500);
      }
    },
  }),
);

beforeEach(() => {
  pinRows = [];
  pinsCache.clear();
});

async function buildApp() {
  const { createApp } = await import("../app.js");
  return createApp();
}

describe("incidents pins endpoint", () => {
  it("GET /api/v1/incidents/pins returns empty items in envelope when no approved rows exist", async () => {
    const app = await buildApp();

    const res = await request(app).get("/api/v1/incidents/pins");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.error).toBeNull();
    expect(res.body.data).toEqual({ items: [], total: 0 });
    expect(typeof res.body.timestamp).toBe("string");
    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });

  it("returns approved pins with the minimal marker contract only", async () => {
    pinRows = [
      {
        id: "pin-1",
        title: "Clinic strike report",
        reportDate: "2026-09-08",
        region: "gaza",
        latitude: 31.5,
        longitude: 34.45,
      },
    ];
    const app = await buildApp();

    const res = await request(app).get("/api/v1/incidents/pins");
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.items[0]).toEqual({
      id: "pin-1",
      title: "Clinic strike report",
      reportDate: "2026-09-08",
      region: "gaza",
      latitude: 31.5,
      longitude: 34.45,
    });
    // Moderation-detail fields never leak onto the map
    expect(res.body.data.items[0]).not.toHaveProperty("description");
    expect(res.body.data.items[0]).not.toHaveProperty("sourceUrl");
    expect(res.body.data.items[0]).not.toHaveProperty("evidenceUrl");
    expect(res.body.data.items[0]).not.toHaveProperty("status");
  });

  it("filters pins to the bbox window", async () => {
    pinRows = [
      {
        id: "inside",
        title: "Inside Gaza City",
        reportDate: "2026-09-08",
        region: "gaza",
        latitude: 31.5,
        longitude: 34.45,
      },
      {
        id: "outside",
        title: "Far south",
        reportDate: "2026-09-08",
        region: "rafah",
        latitude: 31.25,
        longitude: 34.25,
      },
    ];
    const app = await buildApp();

    const res = await request(app).get(
      "/api/v1/incidents/pins?bbox=34.4,31.4,34.5,31.6",
    );
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.items[0].id).toBe("inside");
  });

  it("returns 400 VALIDATION_ERROR for a malformed bbox", async () => {
    const app = await buildApp();

    const res = await request(app).get("/api/v1/incidents/pins?bbox=34.4,31.4");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 VALIDATION_ERROR when bbox min exceeds max", async () => {
    const app = await buildApp();

    const res = await request(app).get(
      "/api/v1/incidents/pins?bbox=34.5,31.4,34.4,31.6",
    );
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 VALIDATION_ERROR for out-of-range coordinates", async () => {
    const app = await buildApp();

    const res = await request(app).get(
      "/api/v1/incidents/pins?bbox=34.4,31.4,500,31.6",
    );
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("caps the response at 500 pins", async () => {
    pinRows = Array.from({ length: 520 }, (_, i) => ({
      id: `pin-${i}`,
      title: `Report ${i}`,
      reportDate: "2026-09-08",
      region: "gaza",
      latitude: 31.5,
      longitude: 34.45,
    }));
    const app = await buildApp();

    const res = await request(app).get("/api/v1/incidents/pins");
    expect(res.status).toBe(200);
    expect(res.body.data.total).toBe(500);
    expect(res.body.data.items).toHaveLength(500);
  });

  it("serves identical payload from cache on second request", async () => {
    pinRows = [
      {
        id: "pin-1",
        title: "Clinic strike report",
        reportDate: "2026-09-08",
        region: "gaza",
        latitude: 31.5,
        longitude: 34.45,
      },
    ];
    const app = await buildApp();

    const first = await request(app).get("/api/v1/incidents/pins");
    pinRows = [];
    const second = await request(app).get("/api/v1/incidents/pins");
    expect(second.status).toBe(200);
    expect(second.body.data).toEqual(first.body.data);
  });

  it("does not set a public Cache-Control header on dynamic pin data", async () => {
    const app = await buildApp();

    const res = await request(app).get("/api/v1/incidents/pins");
    expect(res.headers["cache-control"] ?? "").not.toContain("public");
  });
});
