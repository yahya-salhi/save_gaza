import type { Request, Response, NextFunction } from "express";
import { logger } from "../infrastructure/logger.js";

/**
 * Request logging middleware — logs method, path, status, and duration.
 * Skips health checks to reduce noise in logs.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, path } = req;
    const { statusCode } = res;

    if (path === "/health" || path === "/ready") return;

    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    logger.log(level, `${method} ${path} ${statusCode} ${duration}ms`);
  });

  next();
}
