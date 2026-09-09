import type { CachePort } from "../../core/ports/CachePort.js";

interface Entry {
  value: unknown;
  expiresAt: number;
}

/**
 * InMemoryCache — TTL cache adapter for the CachePort.
 *
 * Keeps expired entries so `getStale` can serve the last known value when
 * upstream fails (stale-while-revalidate fallback). Redis can replace this
 * adapter later without touching callers. `REDIS_URL` empty in dev means
 * this is the active store for Slice 2.2.
 */
export class InMemoryCache implements CachePort {
  private readonly store = new Map<string, Entry>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) return undefined;
    return entry.value as T;
  }

  getStale<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  clear(): void {
    this.store.clear();
  }
}
