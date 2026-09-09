import type { SummaryFeedPort } from "../../core/ports/SummaryFeedPort.js";
import type { CachePort } from "../../core/ports/CachePort.js";
import type { Summary } from "../../core/entities/Summary.js";
import { recordSummarySync } from "./syncTracker.js";

/** Cache key for the validated summary payload. */
export const SUMMARY_CACHE_KEY = "summary:v1";

/** Fresh TTL: 5 minutes per the endpoint catalog. */
export const SUMMARY_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * CachedSummaryFeed — stale-while-revalidate decorator around a
 * SummaryFeedPort.
 *
 * - Fresh cache hit → return immediately (no upstream call).
 * - Miss / expired → try upstream; on success cache and return.
 * - Upstream failure with a stale value → serve stale (200).
 * - Upstream failure with empty cache → propagate (502 cold start).
 *
 * Depends only on ports, so the use case stays unchanged.
 */
export class CachedSummaryFeed implements SummaryFeedPort {
  private readonly inner: SummaryFeedPort;
  private readonly cache: CachePort;

  constructor(inner: SummaryFeedPort, cache: CachePort) {
    this.inner = inner;
    this.cache = cache;
  }

  async getSummary(): Promise<Summary> {
    const fresh = this.cache.get<Summary>(SUMMARY_CACHE_KEY);
    if (fresh) return fresh;

    try {
      const summary = await this.inner.getSummary();
      this.cache.set(SUMMARY_CACHE_KEY, summary, SUMMARY_CACHE_TTL_MS);
      recordSummarySync();
      return summary;
    } catch (err) {
      const stale = this.cache.getStale<Summary>(SUMMARY_CACHE_KEY);
      if (stale) return stale;
      throw err;
    }
  }
}
