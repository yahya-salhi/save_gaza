import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useHistory, buildHistoryEndpoint } from "./useHistory.js";
import { historyFixture } from "../__fixtures__/history.js";

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  function Wrapper({ children }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("buildHistoryEndpoint", () => {
  it("encodes the window and pagination into the query string", () => {
    const endpoint = buildHistoryEndpoint({
      startDate: "2026-06-01",
      endDate: "2026-09-09",
      page: 2,
      limit: 50,
    });
    expect(endpoint).toBe(
      "/statistics/history?startDate=2026-06-01&endDate=2026-09-09&page=2&limit=50",
    );
  });

  it("omits undefined dates and defaults to page 1, limit 1000", () => {
    expect(buildHistoryEndpoint()).toBe(
      "/statistics/history?page=1&limit=1000",
    );
  });
});

describe("useHistory", () => {
  it("returns paginated items on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(historyFixture)));

    const { result } = renderHook(
      () => useHistory({ startDate: "2026-09-06", endDate: "2026-09-09" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.total).toBe(4);
    expect(result.current.data.items).toHaveLength(4);
    expect(result.current.data.items[0].report_date).toBe("2026-09-06");
    expect(result.current.data.items[3].killed_cum).toBe(73000);
  });

  it("requests the selected window in the fetch URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(historyFixture));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(
      () => useHistory({ startDate: "2026-09-06", endDate: "2026-09-09" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("startDate=2026-09-06");
    expect(fetchMock.mock.calls[0][0]).toContain("endDate=2026-09-09");
  });

  it("does not fetch when disabled via options", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(historyFixture));
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useHistory({}, { enabled: false }), {
      wrapper: createWrapper(),
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
