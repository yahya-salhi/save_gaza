import { GAZA_REGION } from "../../core/entities/Statistic.js";
import type {
  StatisticRepositoryPort,
  StatisticSnapshot,
} from "../../core/ports/StatisticRepositoryPort.js";

/** Default window for history/export when no dates are given: trailing 90 days. */
export const HISTORY_DEFAULT_WINDOW_DAYS = 90;

/** Dates per chunk when loading a full export window (bounded memory). */
export const HISTORY_EXPORT_CHUNK_SIZE = 500;

export type HistoryItem = Record<string, unknown>;

export interface HistoryPage {
  items: HistoryItem[];
  page: number;
  limit: number;
  total: number;
}

export interface HistoryExport {
  items: HistoryItem[];
  startDate: string;
  endDate: string;
}

/** Shift a YYYY-MM-DD date by `days` (UTC), returning YYYY-MM-DD. */
export function shiftDate(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Flatten an EAV snapshot into a full daily history item: `report_date` /
 * `report_period` plus every verified metric present that day. Internal
 * `_`-prefixed bookkeeping keys are never exposed.
 */
export function toHistoryItem(snap: StatisticSnapshot): HistoryItem {
  const item: HistoryItem = { report_date: snap.reportDate };
  if (snap.reportPeriod !== undefined) {
    item.report_period = snap.reportPeriod;
  }
  for (const [key, value] of Object.entries(snap.metrics)) {
    if (!key.startsWith("_")) {
      item[key] = value;
    }
  }
  return item;
}

/**
 * GetHistoryUseCase — Gaza-only range-filtered daily telemetry off the live
 * EAV table (direct DB indexed query, no cache decorator).
 *
 * Owns the window defaults, the repo query, and the snapshot → item
 * presentation, serving both the paginated `/history` endpoint (`getPage`)
 * and the whole-window `/export` download (`getAll`, chunked so a large
 * window never loads in one unbounded query).
 */
export class GetHistoryUseCase {
  constructor(private readonly repo: StatisticRepositoryPort) {}

  resolveWindow(
    startDate?: string,
    endDate?: string,
  ): { startDate: string; endDate: string } {
    const today = new Date().toISOString().slice(0, 10);
    const end = endDate ?? today;
    return {
      startDate: startDate ?? shiftDate(end, -HISTORY_DEFAULT_WINDOW_DAYS),
      endDate: end,
    };
  }

  async getPage(
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 100,
  ): Promise<HistoryPage> {
    const window = this.resolveWindow(startDate, endDate);
    const offset = (page - 1) * limit;

    const [snapshots, total] = await Promise.all([
      this.repo.getHistory(
        GAZA_REGION,
        window.startDate,
        window.endDate,
        offset,
        limit,
      ),
      this.repo.countHistoryDates(
        GAZA_REGION,
        window.startDate,
        window.endDate,
      ),
    ]);

    return {
      items: snapshots.map(toHistoryItem),
      page,
      limit,
      total,
    };
  }

  async getAll(
    startDate?: string,
    endDate?: string,
  ): Promise<HistoryExport> {
    const window = this.resolveWindow(startDate, endDate);
    const total = await this.repo.countHistoryDates(
      GAZA_REGION,
      window.startDate,
      window.endDate,
    );

    const items: HistoryItem[] = [];
    let offset = 0;
    while (offset < total) {
      const chunk = await this.repo.getHistory(
        GAZA_REGION,
        window.startDate,
        window.endDate,
        offset,
        HISTORY_EXPORT_CHUNK_SIZE,
      );
      if (chunk.length === 0) break;
      for (const snap of chunk) items.push(toHistoryItem(snap));
      offset += chunk.length;
    }

    return { items, ...window };
  }
}
