import type { WestBankDaily } from "../../core/entities/Statistic.js";
import type { SyncWestBankUseCase } from "../../application/use-cases/SyncWestBankUseCase.js";
import type { CachePort } from "../../core/ports/CachePort.js";
import {
  makeCachedStatistics,
  type CachedStatistics,
} from "./cachedStatistics.js";

/** Fixed key — this module caches a single latest West Bank payload. */
export const WEST_BANK_STATISTICS_CACHE_KEY = "statistics:west-bank:v1";

/** Fresh TTL: 15 minutes per the endpoint catalog. */
export const WEST_BANK_STATISTICS_TTL_MS = 15 * 60 * 1000;

/**
 * makeCachedWestBankStatistics — West Bank config adapter over the shared
 * `makeCachedStatistics` factory.
 *
 * Same contract as before (`get()` / `clear()`, same 15-min TTL, same
 * direct-upstream fallback for DB-unavailable cold starts, same
 * stale-while-revalidate). Only the key, TTL, label, and loader wiring stay
 * here; freshness lives in the box.
 */
export function makeCachedWestBankStatistics(
  syncUseCase: SyncWestBankUseCase,
  cache: CachePort,
  upstreamDirect?: () => Promise<WestBankDaily>,
): CachedStatistics<WestBankDaily> {
  return makeCachedStatistics({
    key: WEST_BANK_STATISTICS_CACHE_KEY,
    ttlMs: WEST_BANK_STATISTICS_TTL_MS,
    label: "CachedWestBankStatistics",
    cache,
    load: () => syncUseCase.execute(),
    fallback: upstreamDirect,
  });
}
