import type { Request, Response, NextFunction } from "express";
import { DomainError } from "../core/errors/DomainError.js";
import { logger } from "../infrastructure/logger.js";
import { errorResponse } from "./envelope.js";

// Re-export for backward compatibility
export { successResponse } from "./envelope.js";

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
    res.status(err.statusCode).json(errorResponse(err.code, err.message));
    return;
  }

  // Unknown error — generic 500
  logger.error("Unhandled error:", { message: err.message, stack: err.stack });
  res.status(500).json(errorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
}