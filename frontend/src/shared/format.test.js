import { describe, it, expect } from "vitest";
import { formatCount } from "./format.js";

describe("formatCount", () => {
  it("groups with en-US separators", () => {
    expect(formatCount(73658)).toBe("73,658");
    expect(formatCount(0)).toBe("0");
  });

  it("falls back to an em dash for missing values", () => {
    expect(formatCount(undefined)).toBe("—");
    expect(formatCount(null)).toBe("—");
    expect(formatCount("N/A")).toBe("—");
  });
});
