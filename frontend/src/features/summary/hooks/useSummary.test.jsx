import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiGet } from "../../../shared/api/client.js";
import { useSummary } from "./useSummary.js";
import { summaryFixture } from "../__fixtures__/summary.js";

vi.mock("../../../shared/api/client.js", () => ({
  apiGet: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches from /summary through the envelope client", async () => {
    vi.mocked(apiGet).mockResolvedValue(summaryFixture);

    const { result } = renderHook(() => useSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiGet).toHaveBeenCalledWith("/summary");
    expect(result.current.data.gaza.killed.total).toBe(
      summaryFixture.gaza.killed.total,
    );
  });

  it("surfaces the error state when the request fails", async () => {
    vi.mocked(apiGet).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useSummary(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toMatch(/network error/i);
  });
});
