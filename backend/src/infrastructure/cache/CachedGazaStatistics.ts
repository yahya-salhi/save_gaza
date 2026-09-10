import type { GazaDaily } from "../../core/entities/Statistic.js";
import type { SyncCasualtiesUseCase } from "../../application/use-cases/SyncCasualtiesUseCase.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";

const TTL_MS = 15 * 60 * 1000;

interface CacheEntry {
  data: GazaDaily;
  fetchedAt: number;
}

/**
 * CachedGazaStatistics — 15-minute TTL cache decorator over SyncCasualtiesUseCase.
 *
 * - Cache hit within TTL → return cached value, zero upstream traffic.
 * - Cache miss or TTL expired → fetch, store, return fresh value.
 * - Upstream failure with stale cache → return stale cache, log warning.
 * - DB unavailable (Prisma not configured) → fall back to direct upstream fetch.
 */
export class CachedGazaStatistics {
  private cache: CacheEntry | null = null;
  private upstreamDirect: (() => Promise<GazaDaily>) | null = null;

  constructor(
    private readonly syncUseCase: SyncCasualtiesUseCase,
    upstreamDirect?: () => Promise<GazaDaily>,
  ) {
    this.upstreamDirect = upstreamDirect ?? null;
  }

  async get(): Promise<GazaDaily> {
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
          `[CachedGazaStatistics] upstream failed, serving stale cache (${Math.round((now - this.cache.fetchedAt) / 1000)}s old)`,
        );
        return this.cache.data;
      }

      if (this.upstreamDirect) {
        console.warn(
          "[CachedGazaStatistics] DB unavailable, falling back to direct upstream fetch",
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
