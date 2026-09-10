import { Router } from "express";
import { healthRouter } from "./healthController.js";
import { summaryRouter } from "./summaryController.js";
import { statisticsRouter } from "./statisticsController.js";
import { spatialRouter } from "./spatialController.js";

/**
 * Central API router — mounts all /api/v1/* routes.
 * Health endpoints stay at root (/health, /ready) and are mounted separately in app.ts.
 * Future controllers are added here as the API grows.
 */
export const apiRouter = Router();

// Slice 2.1 — summary endpoint
apiRouter.use(summaryRouter);

// Slice 3.2 — Gaza statistics endpoint
apiRouter.use("/statistics", statisticsRouter);

// Slice 4.1 — spatial boundaries endpoint
apiRouter.use("/spatial", spatialRouter);
