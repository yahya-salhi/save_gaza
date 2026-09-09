import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./HomePage.jsx";
import { summaryFixture } from "../features/summary/__fixtures__/summary.js";

const mocks = vi.hoisted(() => ({
  queryState: {
    data: undefined,
    isLoading: false,
    isError: false,
  },
  refetch: vi.fn(),
}));

vi.mock("../features/summary/hooks/useSummary.js", () => ({
  useSummary: () => ({
    data: mocks.queryState.data,
    isLoading: mocks.queryState.isLoading,
    isError: mocks.queryState.isError,
    refetch: mocks.refetch,
  }),
}));

function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    mocks.queryState.data = undefined;
    mocks.queryState.isLoading = false;
    mocks.queryState.isError = false;
    mocks.refetch.mockClear();
  });

  it("renders the live tally when the summary query succeeds", () => {
    mocks.queryState.data = summaryFixture;
    renderHome();
    expect(screen.getByRole("heading", { name: /save gaza/i })).toBeInTheDocument();
    expect(screen.getByText(/live/i)).toBeInTheDocument();
  });

  it("shows the skeleton while loading", () => {
    mocks.queryState.isLoading = true;
    renderHome();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the human-readable error with retry that refetches", async () => {
    const user = (await import("@testing-library/user-event")).default;
    mocks.queryState.isError = true;
    renderHome();
    expect(screen.getByText(/unable to load/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(mocks.refetch).toHaveBeenCalled();
  });
});
