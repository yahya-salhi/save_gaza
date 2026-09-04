import "dotenv/config";
import { config, validateEnv } from "./config.js";
import { createApp } from "./app.js";
import { logger } from "./infrastructure/logger.js";

validateEnv();

const app = createApp();

app.listen(config.port, () => {
  logger.info(
    `Server running on http://localhost:${config.port} (${config.nodeEnv})`,
  );
});