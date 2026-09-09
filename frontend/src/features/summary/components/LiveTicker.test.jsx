import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import LiveTicker from "./LiveTicker.jsx";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, "LiveTicker.module.css"), "utf8");

describe("LiveTicker", () => {
  it("wraps updates in a polite live region", () => {
    render(<LiveTicker lastUpdate="2026-09-07" />);
    const region = screen.getByText(/live/i).closest("[aria-live]");
    expect(region?.getAttribute("aria-live")).toBe("polite");
  });

  it("renders the timestamp LTR with bidi isolation", () => {
    render(<LiveTicker lastUpdate="2026-09-07" />);
    const date = screen.getByText("2026-09-07");
    expect(date.getAttribute("dir")).toBe("ltr");
  });

  it("renders the label without a date when lastUpdate is missing", () => {
    render(<LiveTicker lastUpdate={null} />);
    expect(screen.getByText(/live/i)).toBeInTheDocument();
  });

  it("hides the pulse dot from assistive tech", () => {
    const { container } = render(<LiveTicker lastUpdate="2026-09-07" />);
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).not.toBeNull();
  });

  it("disables the pulse under prefers-reduced-motion", () => {
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toMatch(/prefers-reduced-motion[^}]*animation:\s*none/s);
  });

  it("uses the data-accent token for the dot, never hardcoded hex", () => {
    expect(css).toContain("var(--accent-500)");
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}/);
  });
});
