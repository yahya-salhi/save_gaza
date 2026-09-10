import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GazaPage from "./GazaPage.jsx";
import { gazaLatestFixture } from "../features/statistics/__fixtures__/gaza.js";

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function renderGaza() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  return render(
    <MemoryRouter initialEntries={["/app/gaza"]}>
      <QueryClientProvider client={queryClient}>
        <GazaPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GazaPage", () => {
  it("renders the Gaza heading", () => {
    renderGaza();
    expect(
      screen.getByRole("heading", { name: /^gaza$/i }),
    ).toBeInTheDocument();
  });

  it("renders breadcrumbs with Gaza current", () => {
    renderGaza();
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    const current = nav.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent("Gaza");
  });

  it("renders the headline tally after data loads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(gazaLatestFixture)),
    );
    renderGaza();
    const section = await screen.findByLabelText(/gaza daily statistics/i);
    expect(section).toBeInTheDocument();
  });

  it("renders the full record with truce, starvation, and aid-seeker groups", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(gazaLatestFixture)),
    );
    renderGaza();
    const detail = await screen.findByLabelText("Full Gaza record");
    expect(detail).toBeInTheDocument();
    expect(
      within(detail).getByText(/killed since 2025 truce/i),
    ).toBeInTheDocument();
    expect(
      within(detail).getByText(/children killed by starvation/i),
    ).toBeInTheDocument();
    expect(
      within(detail).getByText(/aid seekers killed/i),
    ).toBeInTheDocument();
  });

  it("displays loading skeletons while fetching Gaza data", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    renderGaza();
    expect(screen.getByLabelText(/loading gaza/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loading full gaza record/i)).toBeInTheDocument();
  });

  it("shows a single error alert when the feed fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );
    renderGaza();
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(1);
  });
});
