import type { GazaDaily } from "../../core/entities/Statistic.js";
import type { SyncCasualtiesUseCase } from "../../application/use-cases/SyncCasualtiesUseCase.js";
import type { CachePort } from "../../core/ports/CachePort.js";
import {
  makeCachedStatistics,
  type CachedStatistics,
} from "./cachedStatistics.js";

/** Fixed key — this module caches a single latest-Gaza payload. */
export const GAZA_STATISTICS_CACHE_KEY = "statistics:gaza:v1";

/** Fresh TTL: 15 minutes per the endpoint catalog. */
export const GAZA_STATISTICS_TTL_MS = 15 * 60 * 1000;

/**
 * makeCachedGazaStatistics — Gaza config adapter over the shared
 * `makeCachedStatistics` factory.
 *
 * Same contract as before (`get()` / `clear()`, same 15-min TTL, same
 * direct-upstream fallback for DB-unavailable cold starts, same
 * stale-while-revalidate). Only the key, TTL, label, and loader wiring stay
 * here; freshness lives in the box.
 */
export function makeCachedGazaStatistics(
  syncUseCase: SyncCasualtiesUseCase,
  cache: CachePort,
  upstreamDirect?: () => Promise<GazaDaily>,
): CachedStatistics<GazaDaily> {
  return makeCachedStatistics({
    key: GAZA_STATISTICS_CACHE_KEY,
    ttlMs: GAZA_STATISTICS_TTL_MS,
    label: "CachedGazaStatistics",
    cache,
    load: () => syncUseCase.execute(),
    fallback: upstreamDirect,
  });
}
