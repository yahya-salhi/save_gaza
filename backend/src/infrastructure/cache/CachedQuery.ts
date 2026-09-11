import type { CachePort } from "../../core/ports/CachePort.js";

/**
 * CachedQuery — the single generic TTL + stale-while-revalidate box behind
 * the CachePort seam (grilled decision: all 4 read paths, distinct TTLs as
 * params, uniform stale, caller-built string keys, memory now / Redis later,
 * plain values only — gzip/headers stay in the HTTP modules).
 *
 * - Fresh hit → return immediately, zero loader traffic.
 * - Miss / expired → try `loader`; on success store and return.
 * - Loader failure with a stale value → serve stale + warn.
 * - Loader failure with empty cache + `fallback` → try fallback, store, return.
 * - Loader failure with empty cache and no fallback → propagate.
 *
 * Callers own their key strings and TTLs; this module owns freshness,
 * staleness, and the warn logging. Depends only on the CachePort so the
 * Redis swap touches adapters, not callers.
 */
export class CachedQuery {
  constructor(
    private readonly cache: CachePort,
    private readonly label = "CachedQuery",
  ) {}

  async getOrLoad<T>(
    key: string,
    ttlMs: number,
    loader: () => Promise<T>,
    fallback?: () => Promise<T>,
  ): Promise<T> {
    const fresh = this.cache.get<T>(key);
    if (fresh !== undefined) return fresh;

    try {
      const data = await loader();
      this.cache.set(key, data, ttlMs);
      return data;
    } catch (err) {
      const stale = this.cache.getStale<T>(key);
      if (stale !== undefined) {
        console.warn(
          `[${this.label}] loader failed, serving stale cache for ${key}`,
        );
        return stale;
      }

      if (fallback) {
        console.warn(
          `[${this.label}] loader failed with cold cache, falling back to direct load for ${key}`,
        );
        const data = await fallback();
        this.cache.set(key, data, ttlMs);
        return data;
      }

      throw err;
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
