import { Router } from "express";
import { successResponse } from "../middlewares/envelope.js";
import { GetSummaryUseCase } from "../application/use-cases/GetSummaryUseCase.js";
import { TechForPalestineSummaryClient } from "../infrastructure/external/TechForPalestineSummaryClient.js";
import { InMemoryCache } from "../infrastructure/cache/InMemoryCache.js";
import { CachedSummaryFeed } from "../infrastructure/cache/CachedSummaryFeed.js";
import { recordSummarySync } from "../infrastructure/cache/syncTracker.js";

export const summaryRouter = Router();

export const summaryCache = new InMemoryCache();
const summaryClient = new TechForPalestineSummaryClient();
const cachedFeed = new CachedSummaryFeed(
  summaryClient,
  summaryCache,
  recordSummarySync,
);
const getSummaryUseCase = new GetSummaryUseCase(cachedFeed);

summaryRouter.get("/summary", async (_req, res, next) => {
  try {
    const summary = await getSummaryUseCase.execute();
    res.json(successResponse(summary));
  } catch (err) {
    next(err);
  }
});
