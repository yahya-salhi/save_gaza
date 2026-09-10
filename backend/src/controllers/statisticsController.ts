import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../middlewares/envelope.js";
import { CachedGazaStatistics } from "../infrastructure/cache/CachedGazaStatistics.js";
import { SyncCasualtiesUseCase } from "../application/use-cases/SyncCasualtiesUseCase.js";
import { TechForPalestineCasualtiesClient } from "../infrastructure/external/TechForPalestineCasualtiesClient.js";
import { PrismaStatisticRepository } from "../infrastructure/repositories/PrismaStatisticRepository.js";
import { config } from "../config.js";
import { CasualtiesDailySchema } from "../core/schemas/casualtiesDaily.js";
import { ExternalApiError } from "../core/errors/DomainError.js";

const feed = new TechForPalestineCasualtiesClient();
const repo = new PrismaStatisticRepository();
const syncUseCase = new SyncCasualtiesUseCase(feed, repo);

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

export const statisticsRouter = router;
export { cachedStats };
