import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config.js";
import { healthRouter } from "./controllers/healthController.js";
import { apiRouter } from "./controllers/apiRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorResponse } from "./middlewares/envelope.js";

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

  // --- Health routes (root level) ---
  app.use(healthRouter);

  // --- API v1 routes ---
  app.use("/api/v1", apiRouter);

  // --- Static SPA serving (production) ---
  const spaDist = path.resolve(import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname), "../../frontend/dist");
  app.use(express.static(spaDist));

  // SPA catch-all — any non-API, non-static GET route serves index.html
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/") || req.path.startsWith("/health") || req.path.startsWith("/ready")) {
      return next();
    }
    res.sendFile(path.join(spaDist, "index.html"), (err) => {
      if (err) next();
    });
  });

  // API 404 — unmatched /api/* routes return envelope error
  app.use("/api", (_req, res) => {
    res.status(404).json(errorResponse("NOT_FOUND", "Endpoint not found"));
  });

  // Global error handler (must be last middleware)
  app.use(errorHandler);

  return app;
}

export default createApp();
