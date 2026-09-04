import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config.js";
import { healthRouter } from "./controllers/healthController.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

/**
 * Express app — separated from server startup so tests can import it directly.
 */
export function createApp() {
  const app = express();

  // --- Middleware pipeline ---
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*.tile.openstreetmap.org"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
  }));
  app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
  }));
  app.use(express.json());
  app.use(requestLogger);
  app.use(apiLimiter);

  // --- Routes ---
  app.use(healthRouter);

  // Global error handler (must be last middleware)
  app.use(errorHandler);

  return app;
}

export default createApp();