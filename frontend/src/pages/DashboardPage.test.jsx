import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "./DashboardPage.jsx";
import { gazaLatestFixture } from "../features/statistics/__fixtures__/gaza.js";

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  return render(
    <MemoryRouter initialEntries={["/app"]}>
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("DashboardPage", () => {
  it("renders the dashboard header", () => {
    renderDashboard();
    expect(
      screen.getByRole("heading", { name: /war in gaza/i }),
    ).toBeInTheDocument();
  });

  it("renders breadcrumbs with Dashboard current", () => {
    renderDashboard();
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    const current = nav.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent("Dashboard");
  });

  it("renders the static map banner", () => {
    renderDashboard();
    expect(
      screen.getByRole("img", { name: /map preview placeholder/i }),
    ).toBeInTheDocument();
  });

  it("renders the Gaza statistics section after data loads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(gazaLatestFixture)),
    );
    renderDashboard();
    const section = await screen.findByLabelText(/gaza daily statistics/i);
    expect(section).toBeInTheDocument();
  });

  it("displays loading skeleton while fetching Gaza data", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    renderDashboard();
    expect(screen.getByLabelText(/loading gaza/i)).toBeInTheDocument();
  });
});
