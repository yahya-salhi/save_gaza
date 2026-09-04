import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config.js";
import { healthRouter } from "./controllers/healthController.js";
import { errorHandler } from "./middlewares/errorHandler.js";

/**
 * Express app — separated from server startup so tests can import it directly.
 */
export function createApp() {
  const app = express();

  // --- Middleware pipeline ---
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  // --- Routes ---
  app.use(healthRouter);

  // Global error handler (must be last middleware)
  app.use(errorHandler);

  return app;
}

export default createApp();