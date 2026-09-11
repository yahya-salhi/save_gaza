import type { WestBankFeedPort } from "../../core/ports/WestBankFeedPort.js";
import type { StatisticRepositoryPort } from "../../core/ports/StatisticRepositoryPort.js";
import type { WestBankDaily } from "../../core/entities/Statistic.js";
import { WEST_BANK_REGION, VERIFIED_WEST_BANK_METRICS } from "../../core/entities/Statistic.js";
import { WestBankDailySchema } from "../../core/schemas/westBankDaily.js";
import type { WestBankDailyRow } from "../../core/schemas/westBankDaily.js";
import { SyncDailyUseCase } from "./SyncDailyUseCase.js";

/**
 * SyncWestBankUseCase — thin West Bank adapter over the shared
 * SyncDailyUseCase.
 *
 * Same interface as before (constructor + `execute()`). `flash_source` is a
 * string carried on the response from the latest row — never persisted (EAV
 * values are integers) — so no extras hook is passed.
 */
export class SyncWestBankUseCase {
  private readonly inner: SyncDailyUseCase<WestBankDailyRow, WestBankDaily>;

  constructor(feed: WestBankFeedPort, repo: StatisticRepositoryPort) {
    this.inner = new SyncDailyUseCase({
      feed,
      repo,
      region: WEST_BANK_REGION,
      feedName: "West Bank",
      persistedErrorMessage: "Failed to read persisted West Bank statistics",
      schema: WestBankDailySchema,
      metrics: VERIFIED_WEST_BANK_METRICS,
      toDaily: (d) => ({
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
      }),
    });
  }

  execute(): Promise<WestBankDaily> {
    return this.inner.execute();
  }
}
