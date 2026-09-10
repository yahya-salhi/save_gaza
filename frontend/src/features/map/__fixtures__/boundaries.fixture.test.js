import { describe, it, expect } from "vitest";
import { boundariesFixture } from "./boundaries.js";

describe("boundaries fixture", () => {
  it("models the unwrapped spatial contract without envelope keys at feature level", () => {
    const { data } = boundariesFixture;
    expect(data.type).toBe("FeatureCollection");
    expect(data.features).toHaveLength(5);
    for (const feature of data.features) {
      expect(feature).not.toHaveProperty("success");
      expect(feature).not.toHaveProperty("error");
      expect(feature).not.toHaveProperty("timestamp");
      expect(feature.type).toBe("Feature");
      expect(feature.geometry.type).toBe("Polygon");
      expect(feature.properties.id).toBe(feature.id);
    }
  });

  it("orders governorates north to south with stable ids", () => {
    const ids = boundariesFixture.data.features.map((f) => f.id);
    expect(ids).toEqual([
      "north-gaza",
      "gaza",
      "deir-al-balah",
      "khan-younis",
      "rafah",
    ]);
  });
});
