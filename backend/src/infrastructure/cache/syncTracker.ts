/**
 * Sync tracker — last successful upstream sync timestamp.
 *
 * Slice 3.1 wires this into `GET /ready` as `db.syncedAt`. The timestamp is
 * recorded whenever `CachedSummaryFeed` successfully caches an upstream
 * payload. `null` means no successful sync yet in this process lifetime.
 * Redis-backed sync tracking can replace this module in Slice 6.3 without
 * touching callers.
 */

let lastSummarySyncAt: string | null = null;

export function recordSummarySync(at: Date = new Date()): void {
  lastSummarySyncAt = at.toISOString();
}

export function getLastSummarySyncAt(): string | null {
  return lastSummarySyncAt;
}

export function resetLastSummarySyncAt(): void {
  lastSummarySyncAt = null;
}
