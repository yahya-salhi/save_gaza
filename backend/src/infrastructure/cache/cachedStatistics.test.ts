import { describe, it, expect, vi } from "vitest";
import { makeCachedStatistics } from "./cachedStatistics.js";
import { InMemoryCache } from "./InMemoryCache.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";

function failingLoader(): () => Promise<never> {
  return () => Promise.reject(new ExternalApiError("boom"));
}

describe("makeCachedStatistics", () => {
  it("loads once and serves fresh without a second call", async () => {
    const load = vi.fn().mockResolvedValue({ report_date: "2026-09-09" });
    const stats = makeCachedStatistics({
      key: "test:gaza:v1",
      ttlMs: 15 * 60 * 1000,
      label: "test",
      cache: new InMemoryCache(),
      load,
    });

    expect(await stats.get()).toEqual({ report_date: "2026-09-09" });
    expect(await stats.get()).toEqual({ report_date: "2026-09-09" });
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("uses the fallback on cold loader failure", async () => {
    const stats = makeCachedStatistics({
      key: "test:gaza:v1",
      ttlMs: 15 * 60 * 1000,
      label: "test",
      cache: new InMemoryCache(),
      load: failingLoader(),
      fallback: () => Promise.resolve("direct"),
    });

    await expect(stats.get()).resolves.toBe("direct");
  });

  it("propagates the error on cold failure without a fallback", async () => {
    const stats = makeCachedStatistics({
      key: "test:gaza:v1",
      ttlMs: 15 * 60 * 1000,
      label: "test",
      cache: new InMemoryCache(),
      load: failingLoader(),
    });

    await expect(stats.get()).rejects.toBeInstanceOf(ExternalApiError);
  });

  it("serves stale when the loader fails after a cached value", async () => {
    const cache = new InMemoryCache();
    const stats = makeCachedStatistics({
      key: "test:gaza:v1",
      // Negative TTL: the stored value is immediately stale, so the
      // second get exercises the stale-serve path deterministically.
      ttlMs: -1,
      label: "test",
      cache,
      load: vi
        .fn()
        .mockResolvedValueOnce("first")
        .mockRejectedValue(new ExternalApiError("boom")),
    });

    await expect(stats.get()).resolves.toBe("first");
    await expect(stats.get()).resolves.toBe("first");
  });

  it("clear() forces the next get to reload", async () => {
    const load = vi.fn().mockResolvedValue("v");
    const stats = makeCachedStatistics({
      key: "test:gaza:v1",
      ttlMs: 15 * 60 * 1000,
      label: "test",
      cache: new InMemoryCache(),
      load,
    });

    await stats.get();
    stats.clear();
    await stats.get();
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("isolates keys sharing one cache", async () => {
    const cache = new InMemoryCache();
    const gaza = makeCachedStatistics({
      key: "test:gaza:v1",
      ttlMs: 15 * 60 * 1000,
      label: "test-gaza",
      cache,
      load: () => Promise.resolve("gaza"),
    });
    const westBank = makeCachedStatistics({
      key: "test:west-bank:v1",
      ttlMs: 15 * 60 * 1000,
      label: "test-west-bank",
      cache,
      load: () => Promise.resolve("west-bank"),
    });

    await expect(gaza.get()).resolves.toBe("gaza");
    await expect(westBank.get()).resolves.toBe("west-bank");
  });
});
