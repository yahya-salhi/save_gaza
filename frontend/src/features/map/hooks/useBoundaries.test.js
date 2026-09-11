import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useBoundaries } from "./useBoundaries.js";
import { boundariesFixture } from "../__fixtures__/boundaries.js";

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

describe("useBoundaries", () => {
  it("returns the 5 governorates on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(boundariesFixture)));

    const { result } = renderHook(() => useBoundaries(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.type).toBe("FeatureCollection");
    expect(result.current.data.features).toHaveLength(5);
    expect(result.current.data.features[0].id).toBe("north-gaza");
  });

});
