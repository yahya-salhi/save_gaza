import { describe, it, expect, vi, beforeEach } from "vitest";
import { CachedSummaryFeed, SUMMARY_CACHE_KEY } from "./CachedSummaryFeed.js";
import { InMemoryCache } from "./InMemoryCache.js";
import {
  getLastSummarySyncAt,
  recordSummarySync,
  resetLastSummarySyncAt,
} from "./syncTracker.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import type { SummaryFeedPort } from "../../core/ports/SummaryFeedPort.js";
import type { Summary } from "../../core/entities/Summary.js";

const summaryA = { gaza: { killed: { total: 1 } } } as unknown as Summary;
const summaryB = { gaza: { killed: { total: 2 } } } as unknown as Summary;

function feedReturning(value: Summary): SummaryFeedPort {
  return { getSummary: vi.fn().mockResolvedValue(value) };
}

function feedFailing(): SummaryFeedPort {
  return {
    getSummary: vi.fn().mockRejectedValue(new ExternalApiError("boom")),
  };
}

describe("CachedSummaryFeed", () => {
  beforeEach(() => {
    resetLastSummarySyncAt();
  });

  it("fires onSuccess only on a fresh upstream load", async () => {
    const onSuccess = vi.fn();
    const feed = new CachedSummaryFeed(
      feedReturning(summaryA),
      new InMemoryCache(),
      onSuccess,
    );

    expect(await feed.getSummary()).toBe(summaryA);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    // Fresh hit: served from cache, no second load, no second hook fire.
    expect(await feed.getSummary()).toBe(summaryA);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("wires recordSummarySync through onSuccess in production shape", async () => {
    const feed = new CachedSummaryFeed(
      feedReturning(summaryA),
      new InMemoryCache(),
      recordSummarySync,
    );

    expect(getLastSummarySyncAt()).toBeNull();
    await feed.getSummary();
    expect(typeof getLastSummarySyncAt()).toBe("string");
    expect(Number.isNaN(Date.parse(getLastSummarySyncAt() as string))).toBe(false);
  });

  it("does not fire onSuccess when serving stale", async () => {
    const onSuccess = vi.fn();
    const cache = new InMemoryCache();
    const warm = new CachedSummaryFeed(feedReturning(summaryB), cache, onSuccess);
    await warm.getSummary();
    expect(onSuccess).toHaveBeenCalledTimes(1);

    const cold = new CachedSummaryFeed(feedFailing(), cache, onSuccess);
    await expect(cold.getSummary()).resolves.toBe(summaryB);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("serves stale when upstream fails after a cached value", async () => {
    const cache = new InMemoryCache();
    const warm = new CachedSummaryFeed(feedReturning(summaryB), cache);
    await warm.getSummary();

    const cold = new CachedSummaryFeed(feedFailing(), cache);
    await expect(cold.getSummary()).resolves.toBe(summaryB);
  });

  it("serves expired stale when upstream fails", async () => {
    const cache = new InMemoryCache();
    cache.set(SUMMARY_CACHE_KEY, summaryA, -1);

    const feed = new CachedSummaryFeed(feedFailing(), cache);
    await expect(feed.getSummary()).resolves.toBe(summaryA);
  });

  it("propagates the error on cold-start failure", async () => {
    const onSuccess = vi.fn();
    const feed = new CachedSummaryFeed(feedFailing(), new InMemoryCache(), onSuccess);
    await expect(feed.getSummary()).rejects.toBeInstanceOf(ExternalApiError);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
