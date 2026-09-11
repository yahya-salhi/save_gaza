import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../middlewares/envelope.js";
import { CachedGazaStatistics } from "../infrastructure/cache/CachedGazaStatistics.js";
import { CachedWestBankStatistics } from "../infrastructure/cache/CachedWestBankStatistics.js";
import { SyncCasualtiesUseCase } from "../application/use-cases/SyncCasualtiesUseCase.js";
import { SyncWestBankUseCase } from "../application/use-cases/SyncWestBankUseCase.js";
import { GetHistoryUseCase } from "../application/use-cases/GetHistoryUseCase.js";
import {
  EXPORT_CSV_COLUMNS,
  toCsv,
} from "../application/use-cases/csvSerializer.js";
import { TechForPalestineCasualtiesClient } from "../infrastructure/external/TechForPalestineCasualtiesClient.js";
import { TechForPalestineWestBankClient } from "../infrastructure/external/TechForPalestineWestBankClient.js";
import { PrismaStatisticRepository } from "../infrastructure/repositories/PrismaStatisticRepository.js";
import { HistoryQuerySchema } from "../core/schemas/historyQuery.js";
import { ExportQuerySchema } from "../core/schemas/exportQuery.js";
import {
  ExternalApiError,
  ValidationError,
} from "../core/errors/DomainError.js";
import type { GazaDaily } from "../core/entities/Statistic.js";
import type { WestBankDaily } from "../core/entities/Statistic.js";

const feed = new TechForPalestineCasualtiesClient();
const repo = new PrismaStatisticRepository();
const syncUseCase = new SyncCasualtiesUseCase(feed, repo);

const westBankFeed = new TechForPalestineWestBankClient();
const westBankSyncUseCase = new SyncWestBankUseCase(westBankFeed, repo);

/**
 * DB-unavailable cold-start fallbacks: latest row via the tested feed
 * clients (which already map transport, status, and schema failures to
 * 502 `ExternalApiError`). Replaces the old inline `fetchDirect*Upstream`
 * duplicates.
 */
async function fetchLatestGazaDirect(): Promise<GazaDaily> {
  const rows = await feed.getDailyRows();
  const last = rows[rows.length - 1];
  if (!last) throw new ExternalApiError("Empty upstream feed");
  return last;
}

async function fetchLatestWestBankDirect(): Promise<WestBankDaily> {
  const rows = await westBankFeed.getDailyRows();
  const last = rows[rows.length - 1];
  if (!last) throw new ExternalApiError("Empty upstream feed");
  return last;
}

const cachedStats = new CachedGazaStatistics(syncUseCase, fetchLatestGazaDirect);

const cachedWestBankStats = new CachedWestBankStatistics(
  westBankSyncUseCase,
  fetchLatestWestBankDirect,
);

const historyUseCase = new GetHistoryUseCase(repo);

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

/**
 * statisticsController — GET /api/v1/statistics/history
 *
 * Gaza-only range-filtered daily telemetry — paginated distinct report dates
 * ascending via `GetHistoryUseCase`. Defaults to the trailing 90-day window.
 */
router.get("/history", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = HistoryQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid query parameters",
      );
    }

    const { startDate, endDate, page, limit } = parsed.data;
    res.json(
      successResponse(
        await historyUseCase.getPage(startDate, endDate, page, limit),
      ),
    );
  } catch (err) {
    next(err);
  }
});

/**
 * statisticsController — GET /api/v1/statistics/export
 *
 * Gaza-only researcher download. The sole documented envelope exception:
 * success returns raw file bytes (`text/csv` or `application/json`) as an
 * attachment with `no-store`; failures stay in the standard envelope (e.g.
 * 400 `VALIDATION_ERROR`). The whole selected window is returned in one
 * file — loaded in bounded chunks, no pagination params.
 */
router.get("/export", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = ExportQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid query parameters",
      );
    }

    const { startDate, endDate, format } = parsed.data;
    const { items, startDate: start, endDate: end } =
      await historyUseCase.getAll(startDate, endDate);

    const filename = `gaza-history-${start}-to-${end}.${format}`;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    if (format === "json") {
      res.type("application/json").send(JSON.stringify(items));
      return;
    }

    res.type("text/csv; charset=utf-8").send(toCsv(items, EXPORT_CSV_COLUMNS));
  } catch (err) {
    next(err);
  }
});

export const statisticsRouter = router;
export { cachedStats, cachedWestBankStats, EXPORT_CSV_COLUMNS };
