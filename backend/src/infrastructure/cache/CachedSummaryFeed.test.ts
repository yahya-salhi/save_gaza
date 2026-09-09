import { describe, it, expect, vi, beforeEach } from "vitest";
import { CachedSummaryFeed, SUMMARY_CACHE_KEY } from "./CachedSummaryFeed.js";
import { InMemoryCache } from "./InMemoryCache.js";
import {
  getLastSummarySyncAt,
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

  it("records the sync timestamp on upstream success", async () => {
    const feed = new CachedSummaryFeed(feedReturning(summaryA), new InMemoryCache());
    expect(getLastSummarySyncAt()).toBeNull();
    await feed.getSummary();
    expect(typeof getLastSummarySyncAt()).toBe("string");
    expect(Number.isNaN(Date.parse(getLastSummarySyncAt() as string))).toBe(false);
  });

  it("caches upstream success and serves fresh without a second call", async () => {
    const inner = feedReturning(summaryA);
    const feed = new CachedSummaryFeed(inner, new InMemoryCache());

    expect(await feed.getSummary()).toBe(summaryA);
    expect(await feed.getSummary()).toBe(summaryA);
    expect(inner.getSummary).toHaveBeenCalledTimes(1);
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
    const feed = new CachedSummaryFeed(feedFailing(), new InMemoryCache());
    await expect(feed.getSummary()).rejects.toBeInstanceOf(ExternalApiError);
  });
});
