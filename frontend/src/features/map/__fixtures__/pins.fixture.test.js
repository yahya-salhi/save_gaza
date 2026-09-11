import { describe, it, expect } from "vitest";
import { pinsFixture, emptyPinsFixture } from "./pins.js";

describe("pins fixture", () => {
  it("models the unwrapped pins contract without envelope keys at item level", () => {
    const { items, total } = pinsFixture.data;
    expect(total).toBe(items.length);
    for (const pin of items) {
      expect(pin).not.toHaveProperty("success");
      expect(pin).not.toHaveProperty("error");
      expect(pin).not.toHaveProperty("timestamp");
      expect(typeof pin.id).toBe("string");
      expect(typeof pin.title).toBe("string");
      expect(pin.reportDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof pin.region).toBe("string");
      expect(typeof pin.latitude).toBe("number");
      expect(typeof pin.longitude).toBe("number");
    }
  });

  it("never carries moderation-detail fields onto the map", () => {
    for (const pin of pinsFixture.data.items) {
      expect(pin).not.toHaveProperty("description");
      expect(pin).not.toHaveProperty("sourceUrl");
      expect(pin).not.toHaveProperty("evidenceUrl");
      expect(pin).not.toHaveProperty("status");
    }
  });

  it("models the live empty shape until moderation approves rows", () => {
    expect(emptyPinsFixture.data).toEqual({ items: [], total: 0 });
  });
});
