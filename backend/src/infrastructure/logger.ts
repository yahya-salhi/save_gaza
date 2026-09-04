import winston from "winston";
import { config } from "../config.js";

/**
 * Application logger — Winston with pretty console transport in development
 * and structured JSON in production. Structured request correlation via
 * `x-request-id` is added in a later slice; the middleware will pass a child
 * logger with `requestId` bound.
 */
const format =
  config.nodeEnv === "production"
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.printf(
          ({ level, message, timestamp }) =>
            `${timestamp} [${level}] ${message}`,
        ),
      );

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format,
  transports: [new winston.transports.Console()],
});
