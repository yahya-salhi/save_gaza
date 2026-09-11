import { describe, it, expect } from "vitest";
import { escapeHtml, pinPopupCard } from "./popupCard.js";

describe("escapeHtml", () => {
  it("escapes ampersands and angle brackets", () => {
    expect(escapeHtml("a&b<c")).toBe("a&amp;b&lt;c");
    expect(escapeHtml("Rafah & Khan Younis")).toBe("Rafah &amp; Khan Younis");
  });

  it("stringifies non-strings", () => {
    expect(escapeHtml(2026)).toBe("2026");
    expect(escapeHtml(null)).toBe("null");
  });
});

describe("pinPopupCard", () => {
  const pin = {
    id: "pin-1",
    title: "Clinic strike report",
    reportDate: "2026-09-08",
    region: "gaza",
    latitude: 31.5,
    longitude: 34.45,
  };

  it("renders eyebrow, title, LTR date, and region", () => {
    const html = pinPopupCard(pin);
    expect(html).toContain("Field report");
    expect(html).toContain("Clinic strike report");
    expect(html).toContain("2026-09-08");
    expect(html).toContain("gaza");
    expect(html).toContain('dir="ltr"');
  });

  it("escapes injected fields", () => {
    const html = pinPopupCard({
      ...pin,
      title: "<img>&",
      region: "a&b",
    });
    expect(html).not.toContain("<img>");
    expect(html).toContain("&lt;img>");
    expect(html).toContain("a&amp;b");
  });
});
