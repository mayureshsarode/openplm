import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const app = createApp();

app.listen(config.PORT, () => {
  logger.info(`🚀 OpenPLM backend running on port ${config.PORT}`);
  logger.info(`   Environment: ${config.NODE_ENV}`);
  logger.info(`   Health: http://localhost:${config.PORT}/api/v1/health`);
});
