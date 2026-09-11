import { describe, it, expect, vi } from "vitest";
import { CachedQuery } from "./CachedQuery.js";
import { InMemoryCache } from "./InMemoryCache.js";

const TTL = 15 * 60 * 1000;

describe("CachedQuery", () => {
  it("loads and caches, serving fresh without a second call", async () => {
    const box = new CachedQuery(new InMemoryCache(), "test");
    const loader = vi.fn().mockResolvedValue({ n: 1 });

    await expect(box.getOrLoad("k", TTL, loader)).resolves.toEqual({ n: 1 });
    await expect(box.getOrLoad("k", TTL, loader)).resolves.toEqual({ n: 1 });
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it("serves stale when the loader fails after a cached value", async () => {
    const cache = new InMemoryCache();
    const warm = new CachedQuery(cache, "test");
    await warm.getOrLoad("k", TTL, () => Promise.resolve("good"));

    const cold = new CachedQuery(cache, "test");
    await expect(
      cold.getOrLoad("k", TTL, () => Promise.reject(new Error("boom"))),
    ).resolves.toBe("good");
  });

  it("serves expired stale when the loader fails", async () => {
    const cache = new InMemoryCache();
    cache.set("k", "stale-value", -1);

    const box = new CachedQuery(cache, "test");
    await expect(
      box.getOrLoad("k", TTL, () => Promise.reject(new Error("boom"))),
    ).resolves.toBe("stale-value");
  });

  it("falls back to direct load on cold-start loader failure", async () => {
    const box = new CachedQuery(new InMemoryCache(), "test");
    const fallback = vi.fn().mockResolvedValue("direct");

    await expect(
      box.getOrLoad(
        "k",
        TTL,
        () => Promise.reject(new Error("db down")),
        fallback,
      ),
    ).resolves.toBe("direct");
    expect(fallback).toHaveBeenCalledTimes(1);
    // Second call is a fresh hit — no more loads.
    await expect(
      box.getOrLoad(
        "k",
        TTL,
        () => Promise.reject(new Error("db down")),
        fallback,
      ),
    ).resolves.toBe("direct");
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it("propagates the error on cold-start failure with no fallback", async () => {
    const box = new CachedQuery(new InMemoryCache(), "test");
    await expect(
      box.getOrLoad("k", TTL, () => Promise.reject(new Error("boom"))),
    ).rejects.toThrow("boom");
  });

  it("clear() drops fresh and stale values", async () => {
    const cache = new InMemoryCache();
    const box = new CachedQuery(cache, "test");
    await box.getOrLoad("k", TTL, () => Promise.resolve("v"));
    box.clear();
    await expect(
      box.getOrLoad("k", TTL, () => Promise.reject(new Error("boom"))),
    ).rejects.toThrow("boom");
  });

  it("keeps caller keys isolated", async () => {
    const box = new CachedQuery(new InMemoryCache(), "test");
    await box.getOrLoad("a", TTL, () => Promise.resolve(1));
    await expect(
      box.getOrLoad("b", TTL, () => Promise.resolve(2)),
    ).resolves.toBe(2);
    await expect(
      box.getOrLoad("a", TTL, () => Promise.resolve(999)),
    ).resolves.toBe(1);
  });
});
