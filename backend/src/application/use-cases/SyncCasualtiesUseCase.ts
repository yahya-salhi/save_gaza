import type { CasualtiesFeedPort } from "../../core/ports/CasualtiesFeedPort.js";
import type { StatisticRepositoryPort } from "../../core/ports/StatisticRepositoryPort.js";
import type { GazaDaily } from "../../core/entities/Statistic.js";
import { GAZA_REGION, VERIFIED_GAZA_METRICS } from "../../core/entities/Statistic.js";
import { CasualtiesDailySchema } from "../../core/schemas/casualtiesDaily.js";
import type { CasualtiesDailyRow } from "../../core/schemas/casualtiesDaily.js";
import { SyncDailyUseCase } from "./SyncDailyUseCase.js";

/**
 * Gaza `_report_*` bookkeeping writes. `_report_period` is decoded back by
 * the repository (`getLatest`/`getHistory`); `_report_source` rides along
 * for shape compatibility. Lives here — not in the generic — because only
 * Gaza persists extras.
 */
async function writeGazaExtras(
  repo: StatisticRepositoryPort,
  region: string,
  row: CasualtiesDailyRow,
): Promise<void> {
  await repo.upsertMetric(
    region,
    row.report_date,
    "_report_source",
    "Report source",
    0,
  );
  await repo.upsertMetric(
    region,
    row.report_date,
    "_report_period",
    "Report period",
    row.report_period,
  );
}

/**
 * SyncCasualtiesUseCase — thin Gaza adapter over the shared SyncDailyUseCase.
 *
 * Same interface as before (constructor + `execute()`); only the region,
 * schema, metrics, DTO shape, and Gaza extras wiring stay here.
 */
export class SyncCasualtiesUseCase {
  private readonly inner: SyncDailyUseCase<CasualtiesDailyRow, GazaDaily>;

  constructor(feed: CasualtiesFeedPort, repo: StatisticRepositoryPort) {
    this.inner = new SyncDailyUseCase({
      feed,
      repo,
      region: GAZA_REGION,
      feedName: "Casualties",
      persistedErrorMessage: "Failed to read persisted Gaza statistics",
      schema: CasualtiesDailySchema,
      metrics: VERIFIED_GAZA_METRICS,
      toDaily: (d) => ({
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
      }),
      writeExtras: writeGazaExtras,
    });
  }

  execute(): Promise<GazaDaily> {
    return this.inner.execute();
  }
}
