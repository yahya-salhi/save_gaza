import { Router } from "express";
import { successResponse } from "../middlewares/errorHandler.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json(successResponse({ status: "ok" }));
});

healthRouter.get("/ready", async (_req, res) => {
  // DB ping check will be added when Prisma is wired
  res.json(
    successResponse({
      status: "ok",
      db: { latencyMs: 0, syncedAt: null },
    }),
  );
});