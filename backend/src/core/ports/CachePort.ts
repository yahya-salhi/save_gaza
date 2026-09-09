/**
 * CachePort — abstract interface for TTL caching.
 *
 * The application layer depends on this port (dependency inversion);
 * the infrastructure layer supplies the concrete adapter (in-memory now,
 * Redis later). `get` returns only fresh entries; `getStale` returns the
 * last known value even past TTL so callers can serve stale on failure.
 */
export interface CachePort {
  get<T>(key: string): T | undefined;
  getStale<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlMs: number): void;
  clear(): void;
}
