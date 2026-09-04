import type { Request, Response, NextFunction } from "express";
import { DomainError } from "../core/errors/DomainError.js";
import { logger } from "../infrastructure/logger.js";

interface EnvelopeResponse {
  success: boolean;
  data: unknown;
  error: { code: string; message: string } | null;
  timestamp: string;
}

/**
 * Wraps controller results into the standard API envelope.
 */
export function successResponse(data: unknown): EnvelopeResponse {
  return {
    success: true,
    data,
    error: null,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Express error middleware — formats domain errors into the API envelope.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof DomainError) {
    res.status(err.statusCode).json({
      success: false,
      data: null,
      error: { code: err.code, message: err.message },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Unknown error — generic 500
  logger.error("Unhandled error:", { message: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    data: null,
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    timestamp: new Date().toISOString(),
  });
}