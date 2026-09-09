import { describe, it, expect } from "vitest";
import { InMemoryCache } from "./InMemoryCache.js";

describe("InMemoryCache", () => {
  it("returns a fresh value before TTL expiry", () => {
    const cache = new InMemoryCache();
    cache.set("k", { n: 1 }, 60_000);
    expect(cache.get<{ n: number }>("k")).toEqual({ n: 1 });
  });

  it("returns undefined for missing keys", () => {
    const cache = new InMemoryCache();
    expect(cache.get("missing")).toBeUndefined();
    expect(cache.getStale("missing")).toBeUndefined();
  });

  it("hides expired values from get but keeps them for getStale", () => {
    const cache = new InMemoryCache();
    cache.set("k", "stale-value", -1);
    expect(cache.get("k")).toBeUndefined();
    expect(cache.getStale("k")).toBe("stale-value");
  });

  it("clear removes fresh and stale entries", () => {
    const cache = new InMemoryCache();
    cache.set("k", "v", 60_000);
    cache.clear();
    expect(cache.get("k")).toBeUndefined();
    expect(cache.getStale("k")).toBeUndefined();
  });
});
