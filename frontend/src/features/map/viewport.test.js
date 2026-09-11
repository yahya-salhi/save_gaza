import { describe, it, expect } from "vitest";
import { GAZA_BBOX, round2, bboxToBounds, boundsToBbox } from "./viewport.js";

describe("viewport helpers", () => {
  it("exposes the Gaza envelope as the initial bbox tuple", () => {
    const [minLng, minLat, maxLng, maxLat] = GAZA_BBOX;
    expect(minLng).toBeLessThan(maxLng);
    expect(minLat).toBeLessThan(maxLat);
    expect(GAZA_BBOX).toEqual([34.2, 31.18, 34.58, 31.62]);
  });

  it("rounds coordinates to 2 decimals for stable cache keys", () => {
    expect(round2(34.45678)).toBe(34.46);
    expect(round2(31.5)).toBe(31.5);
    expect(round2(34.2)).toBe(34.2);
  });

  it("projects Leaflet bounds onto a rounded bbox tuple", () => {
    const bounds = {
      getSouthWest: () => ({ lng: 34.201, lat: 31.184 }),
      getNorthEast: () => ({ lng: 34.579, lat: 31.619 }),
    };
    expect(boundsToBbox(bounds)).toEqual([34.2, 31.18, 34.58, 31.62]);
  });

  it("collapses near-identical viewports onto one bbox (no key churn on small pans)", () => {
    const a = {
      getSouthWest: () => ({ lng: 34.201, lat: 31.181 }),
      getNorthEast: () => ({ lng: 34.579, lat: 31.619 }),
    };
    const b = {
      getSouthWest: () => ({ lng: 34.204, lat: 31.184 }),
      getNorthEast: () => ({ lng: 34.576, lat: 31.616 }),
    };
    expect(boundsToBbox(a)).toEqual(boundsToBbox(b));
  });

  it("projects a bbox onto Leaflet lat/lng bounds (single coordinate truth)", () => {
    expect(bboxToBounds(GAZA_BBOX)).toEqual([
      [31.18, 34.2],
      [31.62, 34.58],
    ]);
  });

  it("round-trips with boundsToBbox", () => {
    const bounds = {
      getSouthWest: () => ({ lng: 34.2, lat: 31.18 }),
      getNorthEast: () => ({ lng: 34.58, lat: 31.62 }),
    };
    expect(bboxToBounds(boundsToBbox(bounds))).toEqual([
      [31.18, 34.2],
      [31.62, 34.58],
    ]);
  });
});
