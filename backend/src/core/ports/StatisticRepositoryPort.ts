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
}
