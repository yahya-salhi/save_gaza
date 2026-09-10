import type { WestBankFeedPort } from "../../core/ports/WestBankFeedPort.js";
import type { StatisticRepositoryPort } from "../../core/ports/StatisticRepositoryPort.js";
import type { WestBankDaily } from "../../core/entities/Statistic.js";
import { WEST_BANK_REGION, VERIFIED_WEST_BANK_METRICS } from "../../core/entities/Statistic.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { WestBankDailySchema } from "../../core/schemas/westBankDaily.js";
import type { WestBankDailyRow } from "../../core/schemas/westBankDaily.js";

/**
 * SyncWestBankUseCase — fetch → validate → upsert → return latest West Bank row.
 *
 * Single-step on-demand sync: pulls the full upstream array, validates with
 * Zod, persists verified numeric fields as EAV rows via
 * `StatisticRepositoryPort`, and returns the latest report-date
 * `WestBankDaily` snapshot. `flash_source` is a string carried on the
 * response from the latest row — never persisted (EAV values are integers).
 */
export class SyncWestBankUseCase {
  constructor(
    private readonly feed: WestBankFeedPort,
    private readonly repo: StatisticRepositoryPort,
  ) {}

  async execute(): Promise<WestBankDaily> {
    const rawRows = await this.feed.getDailyRows();
    if (!rawRows || rawRows.length === 0) {
      throw new ExternalApiError("West Bank feed returned empty data");
    }

    const parseResult = WestBankDailySchema.safeParse(rawRows);
    if (!parseResult.success) {
      throw new ExternalApiError(
        `West Bank feed validation failed: ${parseResult.error.issues[0]?.message ?? "unknown"}`,
      );
    }

    const rows: WestBankDailyRow[] = Array.isArray(parseResult.data)
      ? parseResult.data
      : parseResult.data.data;

    let latest: WestBankDailyRow = rows[0]!;
    for (const row of rows) {
      if (row.report_date > latest.report_date) {
        latest = row;
      }
    }

    for (const row of rows) {
      for (const metric of VERIFIED_WEST_BANK_METRICS) {
        const val = row[metric.key];
        if (val !== undefined) {
          await this.repo.upsertMetric(
            WEST_BANK_REGION,
            row.report_date,
            metric.key,
            metric.label,
            val,
          );
        }
      }
    }

    const snapshot = await this.repo.getLatest(WEST_BANK_REGION);

    if (!snapshot) {
      throw new ExternalApiError("Failed to read persisted West Bank statistics");
    }

    const d = latest;
    return {
      report_date: d.report_date,
      flash_source: d.flash_source,
      killed_cum: d.killed_cum,
      killed_children_cum: d.killed_children_cum,
      injured_cum: d.injured_cum,
      injured_children_cum: d.injured_children_cum,
      settler_attacks_cum: d.settler_attacks_cum,
      displaced_households_cum: d.displaced_households_cum,
      displaced_persons_cum: d.displaced_persons_cum,
      displaced_children_cum: d.displaced_children_cum,
    };
  }
}
