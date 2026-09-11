import type { GazaDaily } from "../../core/entities/Statistic.js";
import type { SyncCasualtiesUseCase } from "../../application/use-cases/SyncCasualtiesUseCase.js";
import { InMemoryCache } from "./InMemoryCache.js";
import { CachedQuery } from "./CachedQuery.js";

/** Fixed key — this module caches a single latest-Gaza payload. */
export const GAZA_STATISTICS_CACHE_KEY = "statistics:gaza:v1";

/** Fresh TTL: 15 minutes per the endpoint catalog. */
export const GAZA_STATISTICS_TTL_MS = 15 * 60 * 1000;

/**
 * CachedGazaStatistics — thin adapter over the shared CachedQuery box.
 *
 * Same interface as before (`get()` / `clear()`, same 15-min TTL, same
 * direct-upstream fallback for DB-unavailable cold starts, same
 * stale-while-revalidate). The freshness/staleness logic lives in the box;
 * only the key, TTL, and loader wiring stay here.
 */
export class CachedGazaStatistics {
  private readonly query: CachedQuery;

  constructor(
    private readonly syncUseCase: SyncCasualtiesUseCase,
    private readonly upstreamDirect?: () => Promise<GazaDaily>,
  ) {
    this.query = new CachedQuery(new InMemoryCache(), "CachedGazaStatistics");
  }

  get(): Promise<GazaDaily> {
    return this.query.getOrLoad(
      GAZA_STATISTICS_CACHE_KEY,
      GAZA_STATISTICS_TTL_MS,
      () => this.syncUseCase.execute(),
      this.upstreamDirect,
    );
  }

  clear(): void {
    this.query.clear();
  }
}
