import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { usePins, buildPinsEndpoint } from "./usePins.js";
import { pinsFixture } from "../__fixtures__/pins.js";

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

describe("buildPinsEndpoint", () => {
  it("omits the query string without a bbox", () => {
    expect(buildPinsEndpoint(undefined)).toBe("/incidents/pins");
    expect(buildPinsEndpoint(null)).toBe("/incidents/pins");
  });

  it("serializes the bbox tuple in minLng,minLat,maxLng,maxLat order", () => {
    expect(buildPinsEndpoint([34.4, 31.4, 34.5, 31.6])).toBe(
      "/incidents/pins?bbox=34.4,31.4,34.5,31.6",
    );
  });
});

describe("usePins", () => {
  it("returns items and total on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(pinsFixture)));

    const { result } = renderHook(() => usePins(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.total).toBe(2);
    expect(result.current.data.items[0].id).toBe("pin-1");
  });

  it("requests the bbox window when one is passed", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(pinsFixture));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => usePins([34.4, 31.4, 34.5, 31.6]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("bbox=34.4,31.4,34.5,31.6");
  });

  it("sets isError on network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );

    const { result } = renderHook(() => usePins(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("sets isLoading initially", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));

    const { result } = renderHook(() => usePins(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
