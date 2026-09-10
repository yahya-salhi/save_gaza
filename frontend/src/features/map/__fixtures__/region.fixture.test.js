import { describe, it, expect } from "vitest";
import { regionFixture } from "./region.js";

describe("region fixture", () => {
  it("models the enveloped region contract", () => {
    expect(regionFixture.success).toBe(true);
    expect(regionFixture.error).toBeNull();
    expect(typeof regionFixture.timestamp).toBe("string");
    const { data } = regionFixture;
    expect(data.id).toBe("gaza");
    expect(data.name).toBe("Gaza");
    expect(data.sortOrder).toBe(1);
    expect(data.position).toBe(2);
    expect(data.centroid).toHaveLength(2);
    expect(data.bbox).toHaveLength(4);
  });

  it("carries the curated pre-war overview", () => {
    const { data } = regionFixture;
    expect(data.areaKm2).toBe(74.6);
    expect(data.population2017).toBe(652597);
    expect(data.adminCentre).toBe("Gaza City");
    expect(data.localities).toContain("Al-Shati Camp");
    expect(typeof data.blurb).toBe("string");
    expect(data.overviewSource).toMatch(/pre-war/);
  });

  it("carries identity only — never per-region casualty figures", () => {
    const { data } = regionFixture;
    expect(data).not.toHaveProperty("killed");
    expect(data).not.toHaveProperty("injured");
    expect(data).not.toHaveProperty("damage");
  });
});
