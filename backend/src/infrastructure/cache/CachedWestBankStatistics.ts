import type { WestBankDaily } from "../../core/entities/Statistic.js";
import type { SyncWestBankUseCase } from "../../application/use-cases/SyncWestBankUseCase.js";
import { InMemoryCache } from "./InMemoryCache.js";
import { CachedQuery } from "./CachedQuery.js";

/** Fixed key — this module caches a single latest West Bank payload. */
export const WEST_BANK_STATISTICS_CACHE_KEY = "statistics:west-bank:v1";

/** Fresh TTL: 15 minutes per the endpoint catalog. */
export const WEST_BANK_STATISTICS_TTL_MS = 15 * 60 * 1000;

/**
 * CachedWestBankStatistics — thin adapter over the shared CachedQuery box.
 *
 * Same interface as before (`get()` / `clear()`, same 15-min TTL, same
 * direct-upstream fallback for DB-unavailable cold starts, same
 * stale-while-revalidate). The freshness/staleness logic lives in the box;
 * only the key, TTL, and loader wiring stay here.
 */
export class CachedWestBankStatistics {
  private readonly query: CachedQuery;

  constructor(
    private readonly syncUseCase: SyncWestBankUseCase,
    private readonly upstreamDirect?: () => Promise<WestBankDaily>,
  ) {
    this.query = new CachedQuery(
      new InMemoryCache(),
      "CachedWestBankStatistics",
    );
  }

  get(): Promise<WestBankDaily> {
    return this.query.getOrLoad(
      WEST_BANK_STATISTICS_CACHE_KEY,
      WEST_BANK_STATISTICS_TTL_MS,
      () => this.syncUseCase.execute(),
      this.upstreamDirect,
    );
  }

  clear(): void {
    this.query.clear();
  }
}
