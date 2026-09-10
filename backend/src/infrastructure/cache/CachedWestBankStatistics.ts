import type { WestBankDaily } from "../../core/entities/Statistic.js";
import type { SyncWestBankUseCase } from "../../application/use-cases/SyncWestBankUseCase.js";

const TTL_MS = 15 * 60 * 1000;

interface CacheEntry {
  data: WestBankDaily;
  fetchedAt: number;
}

/**
 * CachedWestBankStatistics — 15-minute TTL cache decorator over SyncWestBankUseCase.
 *
 * - Cache hit within TTL → return cached value, zero upstream traffic.
 * - Cache miss or TTL expired → fetch, store, return fresh value.
 * - Upstream failure with stale cache → return stale cache, log warning.
 * - DB unavailable (Prisma not configured) → fall back to direct upstream fetch.
 */
export class CachedWestBankStatistics {
  private cache: CacheEntry | null = null;
  private upstreamDirect: (() => Promise<WestBankDaily>) | null = null;

  constructor(
    private readonly syncUseCase: SyncWestBankUseCase,
    upstreamDirect?: () => Promise<WestBankDaily>,
  ) {
    this.upstreamDirect = upstreamDirect ?? null;
  }

  async get(): Promise<WestBankDaily> {
    const now = Date.now();
    if (this.cache && now - this.cache.fetchedAt < TTL_MS) {
      return this.cache.data;
    }

    try {
      const data = await this.syncUseCase.execute();
      this.cache = { data, fetchedAt: now };
      return data;
    } catch (err) {
      if (this.cache) {
        console.warn(
          `[CachedWestBankStatistics] upstream failed, serving stale cache (${Math.round((now - this.cache.fetchedAt) / 1000)}s old)`,
        );
        return this.cache.data;
      }

      if (this.upstreamDirect) {
        console.warn(
          "[CachedWestBankStatistics] DB unavailable, falling back to direct upstream fetch",
        );
        const data = await this.upstreamDirect();
        this.cache = { data, fetchedAt: now };
        return data;
      }

      throw err;
    }
  }

  clear(): void {
    this.cache = null;
  }
}
