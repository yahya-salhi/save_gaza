import "dotenv/config";
import { config } from "./config.js";
import { createApp } from "./app.js";
import { logger } from "./infrastructure/logger.js";

const app = createApp();

app.listen(config.port, () => {
  logger.info(
    `Server running on http://localhost:${config.port} (${config.nodeEnv})`,
  );
});