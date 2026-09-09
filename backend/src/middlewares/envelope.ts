/**
 * Standard API response envelope.
 * Every successful endpoint returns { success, data, error, timestamp }.
 * The sole exception is GET /api/v1/statistics/export (raw streaming).
 */
export interface EnvelopeResponse {
  success: boolean;
  data: unknown;
  error: { code: string; message: string } | null;
  timestamp: string;
}

/**
 * Wraps controller results into the standard API envelope.
 * @param {unknown} data - The payload to return to the client.
 * @returns {EnvelopeResponse}
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
 * Wraps error details into the standard failure envelope.
 * @param {string} code - Machine-readable error code.
 * @param {string} message - Human-readable error message.
 * @returns {EnvelopeResponse}
 */
export function errorResponse(code: string, message: string): EnvelopeResponse {
  return {
    success: false,
    data: null,
    error: { code, message },
    timestamp: new Date().toISOString(),
  };
}
