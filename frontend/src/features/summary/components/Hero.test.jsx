import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";
import { summaryFixture } from "../__fixtures__/summary.js";

function renderHero(props = {}) {
  return render(
    <MemoryRouter>
      <Hero {...props} />
    </MemoryRouter>,
  );
}

// The tally renders with a locale thousands separator (e.g. "73 658" vs
// "73,658"). Match the bare digits so the assertion is locale-agnostic.
function tallyMatcher(total) {
  return (_, el) =>
    el?.tagName === "P" && el.textContent.replace(/[\s,.\u202F\u00A0]/g, "") === String(total);
}

describe("Hero", () => {
  it("renders the loaded tally from the summary payload", () => {
    renderHero({ summary: summaryFixture });
    expect(screen.getByRole("heading", { name: /save gaza/i })).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => tallyMatcher(summaryFixture.gaza.killed.total)(_, el)),
    ).toBeInTheDocument();
  });

  it("styles the tally as a mono tabular figure with bidi isolation", () => {
    renderHero({ summary: summaryFixture });
    const tally = screen.getByText((_, el) =>
      tallyMatcher(summaryFixture.gaza.killed.total)(_, el),
    );
    expect(tally.getAttribute("dir")).toBe("ltr");
    expect(tally.className).toContain("font-mono");
    expect(tally.className).toContain("tabular-nums");
    expect(tally.className).toContain("[unicode-bidi:isolate]");
  });

  it("shows the CTA linking to /app", () => {
    renderHero({ summary: summaryFixture });
    const link = screen.getByRole("link", { name: /view the data/i });
    expect(link.getAttribute("href")).toBe("/app");
  });

  it("shows skeleton while loading", () => {
    renderHero({ isLoading: true });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows empty state when no summary and not loading/error", () => {
    renderHero({ summary: null });
    expect(screen.getByText(/no casualty figures/i)).toBeInTheDocument();
  });

  it("shows error state with message and retry", () => {
    const onRetry = vi.fn();
    renderHero({ isError: true, onRetry });
    expect(screen.getByText(/unable to load/i)).toBeInTheDocument();
    screen.getByRole("button", { name: /retry/i }).click();
    expect(onRetry).toHaveBeenCalled();
  });
});
