import rateLimit from "express-rate-limit";

/**
 * General API rate limiter — 100 requests per minute per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { code: "RATE_LIMITED", message: "Too many requests, please try again later" },
    timestamp: new Date().toISOString(),
  },
});

/**
 * Strict limiter for auth & submission endpoints — 5 requests per 15 minutes per IP.
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { code: "RATE_LIMITED", message: "Too many attempts, please try again later" },
    timestamp: new Date().toISOString(),
  },
});
