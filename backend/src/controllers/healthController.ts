import { Router } from "express";
import { successResponse } from "../middlewares/envelope.js";
import { getLastSummarySyncAt } from "../infrastructure/cache/syncTracker.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json(successResponse({ status: "ok" }));
});

healthRouter.get("/ready", async (_req, res) => {
  const result: { status: string; db: { latencyMs: number | null; syncedAt: string | null } } = {
    status: "ok",
    db: { latencyMs: null, syncedAt: getLastSummarySyncAt() },
  };

  try {
    const { prisma } = await import("../infrastructure/database/prismaClient.js");
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    result.db.latencyMs = Date.now() - start;
  } catch {
    result.status = "degraded";
    result.db.latencyMs = null;
  }

  res.json(successResponse(result));
});
