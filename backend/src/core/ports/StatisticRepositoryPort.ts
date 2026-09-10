/**
 * StatisticRepositoryPort — abstract interface for the EAV `Statistic` table.
 *
 * Infrastructure supplies the Prisma implementation; the application use case
 * depends only on this port (dependency inversion).
 */
export interface StatisticSnapshot {
  reportDate: string;
  reportSource?: string;
  reportPeriod?: number;
  metrics: Record<string, number>;
}

export interface StatisticRepositoryPort {
  upsertMetric(
    region: string,
    reportDate: string,
    type: string,
    label: string,
    value: number,
  ): Promise<void>;
  getLatest(
    region: string,
  ): Promise<StatisticSnapshot | null>;
  /**
   * Paginated daily snapshots in ascending `reportDate` order for
   * `GET /api/v1/statistics/history`. `offset`/`limit` apply to distinct
   * report dates, not EAV rows. Reads the existing
   * `@@index([region, reportDate])` — no migration needed.
   */
  getHistory(
    region: string,
    startDate: string,
    endDate: string,
    offset: number,
    limit: number,
  ): Promise<StatisticSnapshot[]>;
  /** Distinct report-date count inside the window (for `total`). */
  countHistoryDates(
    region: string,
    startDate: string,
    endDate: string,
  ): Promise<number>;
}
