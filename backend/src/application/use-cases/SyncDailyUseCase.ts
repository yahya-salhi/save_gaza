import type { StatisticRepositoryPort } from "../../core/ports/StatisticRepositoryPort.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";

/**
 * Minimal structural shape for the daily feed schemas
 * (`CasualtiesDailySchema`, `WestBankDailySchema`): row-array or
 * `{ data }` envelope. The concrete Zod schemas satisfy this without the
 * generic importing either of them.
 */
export interface DailyRowsSchema<Row> {
  safeParse(raw: unknown):
    | { success: true; data: Row[] | { data: Row[] } }
    | { success: false; error: { issues: Array<{ message?: string }> } };
}

export interface SyncDailyParams<Row extends { report_date: string }, Daily> {
  feed: { getDailyRows(): Promise<Row[]> };
  repo: StatisticRepositoryPort;
  /** EAV region key (`gaza`, `west_bank`). */
  region: string;
  /** Feed name for error messages (`Casualties`, `West Bank`). */
  feedName: string;
  /** 502 message when persistence verification fails. */
  persistedErrorMessage: string;
  schema: DailyRowsSchema<Row>;
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
 * SyncDailyUseCase — generic fetch → validate → upsert → return-latest
 * daily sync behind a single interface.
 *
 * Single-step on-demand sync: pulls the full upstream array, validates with
 * Zod, persists verified fields as EAV rows via `StatisticRepositoryPort`
 * (plus optional per-row extras), verifies persistence with a `getLatest`
 * read, and returns the latest report-date payload. Everything that differs
 * between regions (schema, metrics, region, DTO shape, extras) travels as
 * params; the empty-guard, validation, latest-scan, and upsert loop live
 * here once.
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
      schema,
      metrics,
      toDaily,
      writeExtras,
    } = this.params;

    const rawRows = await feed.getDailyRows();
    if (!rawRows || rawRows.length === 0) {
      throw new ExternalApiError(`${feedName} feed returned empty data`);
    }

    const parseResult = schema.safeParse(rawRows);
    if (!parseResult.success) {
      throw new ExternalApiError(
        `${feedName} feed validation failed: ${parseResult.error.issues[0]?.message ?? "unknown"}`,
      );
    }

    const rows: Row[] = Array.isArray(parseResult.data)
      ? parseResult.data
      : parseResult.data.data;

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
