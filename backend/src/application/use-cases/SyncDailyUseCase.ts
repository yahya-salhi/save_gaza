import type { FeedPort } from "../../core/ports/FeedPort.js";
import type { StatisticRepositoryPort } from "../../core/ports/StatisticRepositoryPort.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";

export interface SyncDailyParams<Row extends { report_date: string }, Daily> {
  /** Validated daily rows — parsing is owned by the feed adapter. */
  feed: FeedPort<Row>;
  repo: StatisticRepositoryPort;
  /** EAV region key (`gaza`, `west_bank`). */
  region: string;
  /** Feed name for error messages (`Casualties`, `West Bank`). */
  feedName: string;
  /** 502 message when persistence verification fails. */
  persistedErrorMessage: string;
  /** Verified metric keys persisted to the EAV table, with labels. */
  metrics: ReadonlyArray<{ key: string; label: string }>;
  /** Build the latest-date response payload from the latest row. */
  toDaily: (latest: Row) => Daily;
  /**
   * Per-row extra writes (Gaza `_report_*` bookkeeping). Absent for feeds
   * with nothing extra to persist (West Bank).
   */
  writeExtras?: (
    repo: StatisticRepositoryPort,
    region: string,
    row: Row,
  ) => Promise<void>;
}

/**
 * SyncDailyUseCase — generic fetch → upsert → return-latest daily sync
 * behind a single interface.
 *
 * Single-step on-demand sync: pulls validated rows from the feed adapter,
 * persists verified fields as EAV rows via `StatisticRepositoryPort` (plus
 * optional per-row extras), verifies persistence with a `getLatest` read,
 * and returns the latest report-date payload. Everything that differs
 * between regions (region, metrics, DTO shape, extras) travels as params;
 * the empty-guard, latest-scan, and upsert loop live here once. Validation
 * is owned by the adapter — the rows arriving here are already typed.
 */
export class SyncDailyUseCase<Row extends { report_date: string }, Daily> {
  constructor(private readonly params: SyncDailyParams<Row, Daily>) {}

  async execute(): Promise<Daily> {
    const {
      feed,
      repo,
      region,
      feedName,
      persistedErrorMessage,
      metrics,
      toDaily,
      writeExtras,
    } = this.params;

    const rows = await feed.getDailyRows();
    if (!rows || rows.length === 0) {
      throw new ExternalApiError(`${feedName} feed returned empty data`);
    }

    let latest: Row = rows[0]!;
    for (const row of rows) {
      if (row.report_date > latest.report_date) {
        latest = row;
      }
    }

    for (const row of rows) {
      const record = row as Record<string, unknown>;
      for (const metric of metrics) {
        const val = record[metric.key];
        if (typeof val === "number") {
          await repo.upsertMetric(
            region,
            row.report_date,
            metric.key,
            metric.label,
            val,
          );
        }
      }

      if (writeExtras) {
        await writeExtras(repo, region, row);
      }
    }

    const snapshot = await repo.getLatest(region);

    if (!snapshot) {
      throw new ExternalApiError(persistedErrorMessage);
    }

    return toDaily(latest);
  }
}
