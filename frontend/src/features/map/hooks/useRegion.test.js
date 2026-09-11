import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useRegion } from "./useRegion.js";
import { regionFixture } from "../__fixtures__/region.js";

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

describe("useRegion", () => {
  it("returns the region metadata on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(regionFixture)));

    const { result } = renderHook(() => useRegion("gaza"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.id).toBe("gaza");
    expect(result.current.data.name).toBe("Gaza");
    expect(result.current.data.position).toBe(2);
  });

  it("stays disabled and never fetches without a selected id", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(regionFixture));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useRegion(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.isFetching).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

});
