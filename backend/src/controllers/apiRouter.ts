import { Router } from "express";
import { healthRouter } from "./healthController.js";

/**
 * Central API router — mounts all /api/v1/* routes.
 * Health endpoints stay at root (/health, /ready) and are mounted separately in app.ts.
 * Future controllers are added here as the API grows.
 */
export const apiRouter = Router();

// Slice 2+ controllers will be mounted here, e.g.:
// apiRouter.use(summaryRouter);
// apiRouter.use(statisticsRouter);
