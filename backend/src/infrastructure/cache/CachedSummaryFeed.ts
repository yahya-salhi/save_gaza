import type { SummaryFeedPort } from "../../core/ports/SummaryFeedPort.js";
import type { CachePort } from "../../core/ports/CachePort.js";
import type { Summary } from "../../core/entities/Summary.js";
import { CachedQuery } from "./CachedQuery.js";

/** Cache key for the validated summary payload. */
export const SUMMARY_CACHE_KEY = "summary:v1";

/** Fresh TTL: 5 minutes per the endpoint catalog. */
export const SUMMARY_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * CachedSummaryFeed — stale-while-revalidate decorator around a
 * SummaryFeedPort, served through the shared CachedQuery box.
 *
 * - Fresh cache hit → return immediately (no upstream call).
 * - Miss / expired → try upstream; on success cache and return.
 * - Upstream failure with a stale value → serve stale (200).
 * - Upstream failure with empty cache → propagate (502 cold start).
 *
 * `onSuccess` fires only on a fresh upstream load — never on a stale
 * serve. The summary controller passes `recordSummarySync` so `GET /ready`
 * can report the last successful sync; the side effect is explicit at the
 * call site instead of hidden in this module.
 */
export class CachedSummaryFeed implements SummaryFeedPort {
  private readonly query: CachedQuery;

  constructor(
    private readonly inner: SummaryFeedPort,
    cache: CachePort,
    private readonly onSuccess?: () => void,
  ) {
    this.query = new CachedQuery(cache, "CachedSummaryFeed");
  }

  async getSummary(): Promise<Summary> {
    let loadedFresh = false;
    const summary = await this.query.getOrLoad(
      SUMMARY_CACHE_KEY,
      SUMMARY_CACHE_TTL_MS,
      async () => {
        const fresh = await this.inner.getSummary();
        loadedFresh = true;
        return fresh;
      },
    );
    if (loadedFresh) {
      this.onSuccess?.();
    }
    return summary;
  }
}
