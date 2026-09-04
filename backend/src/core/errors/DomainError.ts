/**
 * DomainError — base class for all domain errors.
 * Subclasses provide specific error codes for the global error middleware.
 */
export class DomainError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ExternalApiError extends DomainError {
  constructor(message = "External API request failed") {
    super(message, "EXTERNAL_API_ERROR", 502);
    this.name = "ExternalApiError";
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}