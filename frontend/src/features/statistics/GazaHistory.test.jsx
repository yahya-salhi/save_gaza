import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GazaHistory, hasDemographics } from "./GazaHistory.jsx";
import { historyFixture, historyNoDemoFixture } from "./__fixtures__/history.js";

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function renderHistory(initialEntries = ["/app/gaza"]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <GazaHistory />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

const emptyHistoryFixture = {
  success: true,
  data: { items: [], page: 1, limit: 100, total: 0 },
  error: null,
  timestamp: "2026-09-09T12:00:00.000Z",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

// Warm up the lazily-loaded chart modules (and the heavy recharts
// transform) before any test starts so timers never starve mid-test.
await import("./TimeSeriesChart.jsx");
await import("./DemographicPie.jsx");

describe("hasDemographics", () => {
  it("is true when either verified counter is present", () => {
    expect(hasDemographics({ killed_children_cum: 10 })).toBe(true);
    expect(hasDemographics({ killed_women_cum: 5 })).toBe(true);
  });

  it("is false when both are missing or the day is nullish", () => {
    expect(hasDemographics({ killed_cum: 100 })).toBe(false);
    expect(hasDemographics(null)).toBe(false);
    expect(hasDemographics(undefined)).toBe(false);
  });
});

describe("GazaHistory", () => {
  it("renders slider, line chart, and pie after data loads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(historyFixture)),
    );
    renderHistory();

    const section = await screen.findByLabelText("Gaza casualty trends");
    expect(section).toBeInTheDocument();
    // Charts arrive via React.lazy — wait for them asynchronously.
    expect(await screen.findByText("Casualties over time")).toBeInTheDocument();
    expect(await screen.findByText("Who was killed")).toBeInTheDocument();
    // Screen-reader series table carries the window values (09-06 is
    // line-table-only; 09-09 also dates the pie caption)
    expect(screen.getByText("2026-09-06")).toBeInTheDocument();
    // Pie legend shows the latest-window breakdown (20,000 children,
    // 12,000 women, 41,000 others of 73,000 killed)
    expect(screen.getByText("20,000")).toBeInTheDocument();
    expect(screen.getByText("41,000")).toBeInTheDocument();
    // Range controls with presets
    expect(screen.getByLabelText("From")).toBeInTheDocument();
    expect(screen.getByLabelText("To")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "90d" })).toBeInTheDocument();
  });

  it("shows a loading skeleton while fetching", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    renderHistory();
    expect(screen.getByLabelText("Loading casualty trends")).toBeInTheDocument();
  });

  it("renders nothing on error to preserve the page single-alert invariant", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );
    renderHistory();

    await waitFor(() =>
      expect(screen.queryByLabelText("Loading casualty trends")).not.toBeInTheDocument(),
    );
    expect(screen.queryByLabelText("Gaza casualty trends")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders nothing when the window has no reports", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(emptyHistoryFixture)),
    );
    renderHistory();

    await waitFor(() =>
      expect(screen.queryByLabelText("Loading casualty trends")).not.toBeInTheDocument(),
    );
    expect(screen.queryByLabelText("Gaza casualty trends")).not.toBeInTheDocument();
  });

  it("writes the edited range into the fetch URL (URL sync)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(historyFixture));
    vi.stubGlobal("fetch", fetchMock);
    renderHistory();

    await screen.findByLabelText("Gaza casualty trends");
    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "2026-08-01" },
    });

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some((call) =>
          String(call[0]).includes("startDate=2026-08-01"),
        ),
      ).toBe(true),
    );
  });

  it("applies ?startDate=&endDate= from the URL on first paint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(historyFixture));
    vi.stubGlobal("fetch", fetchMock);
    renderHistory(["/app/gaza?startDate=2026-08-01&endDate=2026-08-31"]);

    await screen.findByLabelText("Gaza casualty trends");
    expect(fetchMock.mock.calls[0][0]).toContain("startDate=2026-08-01");
    expect(fetchMock.mock.calls[0][0]).toContain("endDate=2026-08-31");
    expect(screen.getByLabelText("From")).toHaveValue("2026-08-01");
    expect(screen.getByLabelText("To")).toHaveValue("2026-08-31");
  });

  it("does not fetch the fallback when the window already has demographics", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(historyFixture));
    vi.stubGlobal("fetch", fetchMock);
    renderHistory();

    await screen.findByText("Who was killed");
    expect(
      fetchMock.mock.calls.some((call) =>
        String(call[0]).includes("startDate=2023-10-07"),
      ),
    ).toBe(false);
  });

  it("falls back to the last verified breakdown, dated, when the window has none", async () => {
    const fetchMock = vi.fn((url) =>
      Promise.resolve(
        jsonResponse(
          String(url).includes("startDate=2023-10-07")
            ? historyFixture
            : historyNoDemoFixture,
        ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    renderHistory();

    await screen.findByLabelText("Gaza casualty trends");
    // Fallback breakdown values with a prominent as-of date
    expect(await screen.findByText("20,000")).toBeInTheDocument();
    expect(screen.getByText(/last verified breakdown/i)).toBeInTheDocument();
    // Line chart still plots the in-window series (09-08 is line-only;
    // 09-09 also dates the fallback pie caption)
    expect(screen.getByText("2026-09-08")).toBeInTheDocument();
  });

  it("shows a neutral note instead of an empty circle when no verified breakdown exists anywhere", async () => {
    const fetchMock = vi.fn((url) =>
      Promise.resolve(
        jsonResponse(
          String(url).includes("startDate=2023-10-07")
            ? emptyHistoryFixture
            : historyNoDemoFixture,
        ),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    renderHistory();

    await screen.findByLabelText("Gaza casualty trends");
    expect(
      await screen.findByText(/no verified demographic breakdown/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: /demographic breakdown/i }),
    ).not.toBeInTheDocument();
  });
});
