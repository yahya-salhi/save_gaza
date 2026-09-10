import type { CasualtiesFeedPort } from "../../core/ports/CasualtiesFeedPort.js";
import type { StatisticRepositoryPort } from "../../core/ports/StatisticRepositoryPort.js";
import type { GazaDaily } from "../../core/entities/Statistic.js";
import { GAZA_REGION, VERIFIED_GAZA_METRICS } from "../../core/entities/Statistic.js";
import { ExternalApiError } from "../../core/errors/DomainError.js";
import { CasualtiesDailySchema } from "../../core/schemas/casualtiesDaily.js";
import type { CasualtiesDailyRow } from "../../core/schemas/casualtiesDaily.js";

/**
 * SyncCasualtiesUseCase — fetch → validate → upsert → return latest Gaza row.
 *
 * Single-step on-demand sync: pulls the full upstream array, validates with
 * Zod, persists verified fields as EAV rows via `StatisticRepositoryPort`,
 * and returns the latest report-date `GazaDaily` snapshot.
 */
export class SyncCasualtiesUseCase {
  constructor(
    private readonly feed: CasualtiesFeedPort,
    private readonly repo: StatisticRepositoryPort,
  ) {}

  async execute(): Promise<GazaDaily> {
    const rawRows = await this.feed.getDailyRows();
    if (!rawRows || rawRows.length === 0) {
      throw new ExternalApiError("Casualties feed returned empty data");
    }

    const parseResult = CasualtiesDailySchema.safeParse(rawRows);
    if (!parseResult.success) {
      throw new ExternalApiError(
        `Casualties feed validation failed: ${parseResult.error.issues[0]?.message ?? "unknown"}`,
      );
    }

    const rows: CasualtiesDailyRow[] = Array.isArray(parseResult.data)
      ? parseResult.data
      : parseResult.data.data;

    let latest: CasualtiesDailyRow = rows[0]!;
    for (const row of rows) {
      if (row.report_date > latest.report_date) {
        latest = row;
      }
    }

    for (const row of rows) {
      for (const metric of VERIFIED_GAZA_METRICS) {
        const val = row[metric.key];
        if (val !== undefined) {
          await this.repo.upsertMetric(
            GAZA_REGION,
            row.report_date,
            metric.key,
            metric.label,
            val,
          );
        }
      }

      await this.repo.upsertMetric(
        GAZA_REGION,
        row.report_date,
        "_report_source",
        "Report source",
        0,
      );
      await this.repo.upsertMetric(
        GAZA_REGION,
        row.report_date,
        "_report_period",
        "Report period",
        row.report_period,
      );
    }

    const snapshot = await this.repo.getLatest(GAZA_REGION);

    if (!snapshot) {
      throw new ExternalApiError("Failed to read persisted Gaza statistics");
    }

    const d = latest;
    return {
      report_date: d.report_date,
      report_source: d.report_source,
      report_period: d.report_period,
      massacres_cum: d.massacres_cum,
      killed: d.killed,
      killed_cum: d.killed_cum,
      killed_children_cum: d.killed_children_cum,
      killed_women_cum: d.killed_women_cum,
      killed_recovered: d.killed_recovered,
      killed_succumbed: d.killed_succumbed,
      killed_truce_new: d.killed_truce_new,
      killed_committee: d.killed_committee,
      child_famine_cum: d.child_famine_cum,
      famine_cum: d.famine_cum,
      aid_seeker_killed_cum: d.aid_seeker_killed_cum,
      aid_seeker_injured_cum: d.aid_seeker_injured_cum,
      injured: d.injured,
      injured_cum: d.injured_cum,
      civdef_killed_cum: d.civdef_killed_cum,
      med_killed_cum: d.med_killed_cum,
      press_killed_cum: d.press_killed_cum,
    };
  }
}
