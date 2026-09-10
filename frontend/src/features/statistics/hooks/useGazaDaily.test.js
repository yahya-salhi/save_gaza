import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useGazaDaily } from "./useGazaDaily.js";
import { gazaLatestFixture } from "../__fixtures__/gaza.js";

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

describe("useGazaDaily", () => {
  it("returns data on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(gazaLatestFixture)));

    const { result } = renderHook(() => useGazaDaily(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.report_date).toBe("2026-09-09");
    expect(result.current.data.killed_cum).toBe(73000);
    expect(result.current.data.press_killed_cum).toBe(260);
  });

  it("sets isError on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const { result } = renderHook(() => useGazaDaily(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("sets isLoading initially", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    const { result } = renderHook(() => useGazaDaily(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
