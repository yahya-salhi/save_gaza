import { CachedQuery } from "./CachedQuery.js";
import type { CachePort } from "../../core/ports/CachePort.js";

export interface CachedStatisticsOptions<T> {
  /** Fixed cache key — each adapter caches a single latest payload. */
  key: string;
  /** Fresh TTL in ms (endpoint catalog: 15 minutes for daily statistics). */
  ttlMs: number;
  /** Label for the box's stale/fallback warnings. */
  label: string;
  /** Cache owned by the caller (controllers create + export it). */
  cache: CachePort;
  /** Fresh loader — the sync use case. */
  load: () => Promise<T>;
  /** Cold-start fallback for DB-unavailable boots (direct upstream rows). */
  fallback?: () => Promise<T>;
}

export interface CachedStatistics<T> {
  get(): Promise<T>;
  clear(): void;
}

/**
 * makeCachedStatistics — the single factory for latest-payload read paths
 * (Gaza daily casualties, West Bank telemetry) over the shared CachedQuery
 * box.
 *
 * Collapses the former `CachedGazaStatistics` / `CachedWestBankStatistics`
 * pair, which were textually identical modulo key, TTL, type, and loader.
 * Freshness, staleness, fallback, and warnings live in the box; only the
 * key, TTL, label, cache, and loader wiring travel here per adapter.
 */
export function makeCachedStatistics<T>({
  key,
  ttlMs,
  label,
  cache,
  load,
  fallback,
}: CachedStatisticsOptions<T>): CachedStatistics<T> {
  const query = new CachedQuery(cache, label);
  return {
    get: () => query.getOrLoad(key, ttlMs, load, fallback),
    clear: () => query.clear(),
  };
}
