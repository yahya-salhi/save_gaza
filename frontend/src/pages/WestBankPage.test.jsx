import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WestBankPage from "./WestBankPage.jsx";
import { westBankLatestFixture } from "../features/statistics/__fixtures__/westBank.js";

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function renderWestBank() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  return render(
    <MemoryRouter initialEntries={["/app/westBank"]}>
      <QueryClientProvider client={queryClient}>
        <WestBankPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("WestBankPage", () => {
  it("renders the West Bank heading", () => {
    renderWestBank();
    expect(
      screen.getByRole("heading", { name: /west bank/i }),
    ).toBeInTheDocument();
  });

  it("renders breadcrumbs with West Bank current", () => {
    renderWestBank();
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    const current = nav.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent("West Bank");
  });

  it("renders the West Bank statistics section after data loads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(westBankLatestFixture)),
    );
    renderWestBank();
    const section = await screen.findByLabelText(/west bank daily statistics/i);
    expect(section).toBeInTheDocument();
  });

  it("displays loading skeleton while fetching West Bank data", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    renderWestBank();
    expect(screen.getByLabelText(/loading west bank/i)).toBeInTheDocument();
  });

  it("shows an error with no arrests card when the feed fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );
    renderWestBank();
    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
  });
});
