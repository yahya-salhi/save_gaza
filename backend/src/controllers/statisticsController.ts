import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../middlewares/envelope.js";
import { CachedGazaStatistics } from "../infrastructure/cache/CachedGazaStatistics.js";
import { CachedWestBankStatistics } from "../infrastructure/cache/CachedWestBankStatistics.js";
import { SyncCasualtiesUseCase } from "../application/use-cases/SyncCasualtiesUseCase.js";
import { SyncWestBankUseCase } from "../application/use-cases/SyncWestBankUseCase.js";
import { TechForPalestineCasualtiesClient } from "../infrastructure/external/TechForPalestineCasualtiesClient.js";
import { TechForPalestineWestBankClient } from "../infrastructure/external/TechForPalestineWestBankClient.js";
import { PrismaStatisticRepository } from "../infrastructure/repositories/PrismaStatisticRepository.js";
import { config } from "../config.js";
import { CasualtiesDailySchema } from "../core/schemas/casualtiesDaily.js";
import { WestBankDailySchema } from "../core/schemas/westBankDaily.js";
import { HistoryQuerySchema } from "../core/schemas/historyQuery.js";
import {
  ExternalApiError,
  ValidationError,
} from "../core/errors/DomainError.js";
import { GAZA_REGION } from "../core/entities/Statistic.js";
import type { StatisticSnapshot } from "../core/ports/StatisticRepositoryPort.js";

const feed = new TechForPalestineCasualtiesClient();
const repo = new PrismaStatisticRepository();
const syncUseCase = new SyncCasualtiesUseCase(feed, repo);

const westBankFeed = new TechForPalestineWestBankClient();
const westBankSyncUseCase = new SyncWestBankUseCase(westBankFeed, repo);

async function fetchDirectUpstream() {
  const res = await fetch(config.casualtiesFeedUrl, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new ExternalApiError(`Upstream returned ${res.status}`);
  }
  const raw = await res.json();
  const result = CasualtiesDailySchema.parse(raw);
  const rows = Array.isArray(result) ? result : result.data;
  if (rows.length === 0) throw new ExternalApiError("Empty upstream feed");
  return rows[rows.length - 1];
}

const cachedStats = new CachedGazaStatistics(syncUseCase, fetchDirectUpstream);

async function fetchDirectWestBankUpstream() {
  const res = await fetch(config.westBankFeedUrl, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new ExternalApiError(`Upstream returned ${res.status}`);
  }
  const raw = await res.json();
  const result = WestBankDailySchema.parse(raw);
  const rows = Array.isArray(result) ? result : result.data;
  if (rows.length === 0) throw new ExternalApiError("Empty upstream feed");
  return rows[rows.length - 1];
}

const cachedWestBankStats = new CachedWestBankStatistics(
  westBankSyncUseCase,
  fetchDirectWestBankUpstream,
);

/**
 * statisticsController — GET /api/v1/statistics/gaza
 *
 * Returns the latest Gaza daily casualty/injury record as a single JSON object
 * inside the standard `{ success, data, error, timestamp }` envelope.
 */
const router = Router();

router.get("/gaza", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await cachedStats.get();
    res.json(successResponse(data));
  } catch (err) {
    next(err);
  }
});

router.get("/west-bank", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await cachedWestBankStats.get();
    res.json(successResponse(data));
  } catch (err) {
    next(err);
  }
});

/** Shift a YYYY-MM-DD date by `days` (UTC), returning YYYY-MM-DD. */
function shiftDate(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Flatten an EAV snapshot into a full daily history item: `report_date` /
 * `report_period` plus every verified metric present that day. Internal
 * `_`-prefixed bookkeeping keys are never exposed.
 */
function toHistoryItem(snap: StatisticSnapshot): Record<string, unknown> {
  const item: Record<string, unknown> = { report_date: snap.reportDate };
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
 * statisticsController — GET /api/v1/statistics/history
 *
 * Gaza-only (Slice 3.4) range-filtered daily telemetry off the live EAV
 * table — direct DB indexed query, no cache decorator. Defaults to the
 * trailing 90-day window; paginates distinct report dates ascending.
 */
router.get("/history", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = HistoryQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid query parameters",
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const endDate = parsed.data.endDate ?? today;
    const startDate = parsed.data.startDate ?? shiftDate(endDate, -90);
    const { page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    const [snapshots, total] = await Promise.all([
      repo.getHistory(GAZA_REGION, startDate, endDate, offset, limit),
      repo.countHistoryDates(GAZA_REGION, startDate, endDate),
    ]);

    res.json(
      successResponse({
        items: snapshots.map(toHistoryItem),
        page,
        limit,
        total,
      }),
    );
  } catch (err) {
    next(err);
  }
});

export const statisticsRouter = router;
export { cachedStats, cachedWestBankStats };
