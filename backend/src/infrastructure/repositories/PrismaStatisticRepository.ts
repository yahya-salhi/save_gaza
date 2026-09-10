import type {
  StatisticRepositoryPort,
  StatisticSnapshot,
} from "../../core/ports/StatisticRepositoryPort.js";
import { GAZA_REGION, VERIFIED_GAZA_METRICS } from "../../core/entities/Statistic.js";

const METRIC_LABEL_MAP = new Map(
  VERIFIED_GAZA_METRICS.map((m) => [m.key, m.label] as const),
);

/**
 * PrismaStatisticRepository — Prisma implementation of StatisticRepositoryPort.
 *
 * Uses the existing EAV `Statistic` table (`@@unique([region, reportDate, type])`).
 * Upserts are keyed on `(region, reportDate, type)` so the use case can call
 * `upsertMetric` per row per metric idempotently.
 */
export class PrismaStatisticRepository implements StatisticRepositoryPort {
  /**
   * Lazily import Prisma so tests can mock `../../infrastructure/database/prismaClient.js`.
   */
  private async prisma() {
    const { prisma } = await import("../../infrastructure/database/prismaClient.js");
    return prisma;
  }

  async upsertMetric(
    region: string,
    reportDate: string,
    type: string,
    label: string,
    value: number,
  ): Promise<void> {
    const db = await this.prisma();
    await db.statistic.upsert({
      where: {
        region_reportDate_type: {
          region,
          reportDate: new Date(reportDate),
          type,
        },
      },
      update: { value, label },
      create: {
        region,
        reportDate: new Date(reportDate),
        type,
        label,
        value,
      },
    });
  }

  async getLatest(region: string): Promise<StatisticSnapshot | null> {
    const db = await this.prisma();

    const rows = await db.statistic.findMany({
      where: { region },
      orderBy: { reportDate: "desc" },
      select: {
        reportDate: true,
        type: true,
        value: true,
        label: true,
      },
      take: 1,
    });

    if (rows.length === 0) return null;

    const latestDate = rows[0].reportDate.toISOString().slice(0, 10);

    const allRows = await db.statistic.findMany({
      where: {
        region,
        reportDate: new Date(latestDate),
      },
      select: {
        type: true,
        value: true,
        label: true,
      },
    });

    const metrics: Record<string, number> = {};
    for (const row of allRows) {
      metrics[row.type] = row.value;
    }

    return {
      reportDate: latestDate,
      reportSource: metrics["_report_source"]
        ? String(metrics["_report_source"])
        : undefined,
      reportPeriod: metrics["_report_period"]
        ? metrics["_report_period"]
        : undefined,
      metrics,
    };
  }

  async getHistory(
    region: string,
    startDate: string,
    endDate: string,
    offset: number,
    limit: number,
  ): Promise<StatisticSnapshot[]> {
    const db = await this.prisma();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dateRows = await db.statistic.findMany({
      where: { region, reportDate: { gte: start, lte: end } },
      select: { reportDate: true },
      distinct: ["reportDate"],
      orderBy: { reportDate: "asc" },
      skip: offset,
      take: limit,
    });

    if (dateRows.length === 0) return [];

    const rows = await db.statistic.findMany({
      where: {
        region,
        reportDate: { in: dateRows.map((d) => d.reportDate) },
      },
      select: { reportDate: true, type: true, value: true },
      orderBy: { reportDate: "asc" },
    });

    const byDate = new Map<string, StatisticSnapshot>();
    for (const row of rows) {
      const key = row.reportDate.toISOString().slice(0, 10);
      let snap = byDate.get(key);
      if (!snap) {
        snap = { reportDate: key, metrics: {} };
        byDate.set(key, snap);
      }
      snap.metrics[row.type] = row.value;
    }

    for (const snap of byDate.values()) {
      if (typeof snap.metrics["_report_period"] === "number") {
        snap.reportPeriod = snap.metrics["_report_period"];
      }
    }

    return [...byDate.values()];
  }

  async countHistoryDates(
    region: string,
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const db = await this.prisma();
    const groups = await db.statistic.groupBy({
      by: ["reportDate"],
      where: {
        region,
        reportDate: { gte: new Date(startDate), lte: new Date(endDate) },
      },
    });
    return groups.length;
  }
}
