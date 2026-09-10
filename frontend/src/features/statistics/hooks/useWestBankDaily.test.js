import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useWestBankDaily } from "./useWestBankDaily.js";
import { westBankLatestFixture } from "../__fixtures__/westBank.js";

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

describe("useWestBankDaily", () => {
  it("returns data on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(westBankLatestFixture)));

    const { result } = renderHook(() => useWestBankDaily(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.report_date).toBe("2026-09-09");
    expect(result.current.data.killed_cum).toBe(1114);
    expect(result.current.data.settler_attacks_cum).toBe(4554);
  });

  it("sets isError on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const { result } = renderHook(() => useWestBankDaily(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("sets isLoading initially", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    const { result } = renderHook(() => useWestBankDaily(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
