import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { apiGet } from "./client.js";
import { makeQueryHook } from "./queryHooks.js";

vi.mock("./client.js", () => ({
  apiGet: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  function Wrapper({ children }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("makeQueryHook", () => {
  it("forwards the resolved endpoint to apiGet and returns its data", async () => {
    vi.mocked(apiGet).mockResolvedValue({ report_date: "2026-09-09" });
    const useStatic = makeQueryHook(() => ({
      queryKey: ["factory", "static"],
      endpoint: "/static",
      staleTime: 60_000,
    }));

    const { result } = renderHook(() => useStatic(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiGet).toHaveBeenCalledTimes(1);
    expect(apiGet).toHaveBeenCalledWith("/static");
    expect(result.current.data).toEqual({ report_date: "2026-09-09" });
  });

  it("accepts a builder function as the endpoint", async () => {
    vi.mocked(apiGet).mockResolvedValue({ items: [] });
    const useBuilt = makeQueryHook((id) => ({
      queryKey: ["factory", "built", id],
      endpoint: () => `/items/${id}`,
    }));

    const { result } = renderHook(() => useBuilt("a"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiGet).toHaveBeenCalledWith("/items/a");
  });

  it("isolates caches per queryKey", async () => {
    vi.mocked(apiGet).mockImplementation((endpoint) => Promise.resolve({ endpoint }));
    const useKeyed = makeQueryHook((id) => ({
      queryKey: ["factory", "keyed", id],
      endpoint: `/items/${id}`,
    }));
    const Wrapper = createWrapper();

    const first = renderHook(() => useKeyed("a"), { wrapper: Wrapper });
    const second = renderHook(() => useKeyed("b"), { wrapper: Wrapper });

    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(second.result.current.isSuccess).toBe(true));
    expect(apiGet).toHaveBeenCalledWith("/items/a");
    expect(apiGet).toHaveBeenCalledWith("/items/b");
    expect(first.result.current.data).toEqual({ endpoint: "/items/a" });
    expect(second.result.current.data).toEqual({ endpoint: "/items/b" });
  });

  it("never fetches while enabled is false", async () => {
    vi.mocked(apiGet).mockResolvedValue({});
    const useGated = makeQueryHook((id) => ({
      queryKey: ["factory", "gated", id],
      endpoint: `/items/${id}`,
      enabled: id !== null && id !== undefined && id !== "",
    }));

    const { result } = renderHook(() => useGated(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.status).toBe("pending");
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.isFetching).toBe(false);
    expect(apiGet).not.toHaveBeenCalled();
  });

  it("surfaces apiGet rejection as the error state", async () => {
    vi.mocked(apiGet).mockRejectedValue(new Error("Upstream down"));
    const useFailing = makeQueryHook(() => ({
      queryKey: ["factory", "failing"],
      endpoint: "/failing",
    }));

    const { result } = renderHook(() => useFailing(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toMatch(/upstream down/i);
  });

  it("respects staleTime across remounts on a shared client", async () => {
    vi.mocked(apiGet).mockResolvedValue({ ok: true });
    const useCached = makeQueryHook(() => ({
      queryKey: ["factory", "cached"],
      endpoint: "/cached",
      staleTime: 60_000,
    }));
    const Wrapper = createWrapper();

    const first = renderHook(() => useCached(), { wrapper: Wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();

    const second = renderHook(() => useCached(), { wrapper: Wrapper });
    await waitFor(() => expect(second.result.current.isSuccess).toBe(true));
    expect(apiGet).toHaveBeenCalledTimes(1);
  });

  it("polls while refetchInterval elapses", async () => {
    vi.mocked(apiGet).mockResolvedValue({ ok: true });
    const useLive = makeQueryHook(() => ({
      queryKey: ["factory", "live"],
      endpoint: "/live",
      staleTime: 0,
      refetchInterval: 50,
    }));

    renderHook(() => useLive(), { wrapper: createWrapper() });

    await waitFor(
      () => expect(vi.mocked(apiGet).mock.calls.length).toBeGreaterThanOrEqual(2),
      { timeout: 2000 },
    );
  });
});
