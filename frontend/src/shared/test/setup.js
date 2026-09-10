import "@testing-library/jest-dom/vitest";

// jsdom lacks ResizeObserver (required by Recharts ResponsiveContainer).
// A no-op stub lets charts mount in tests; SVG geometry stays empty and
// content assertions run against the accessible fallbacks (sr-only data
// tables, legends, headings) rather than rendered paths.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}