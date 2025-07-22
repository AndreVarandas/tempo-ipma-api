import { createApp } from './app';
import { ENV } from './config/environment';
import { logger } from './utils/logger';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  logger.info(`IPMA API wrapper running on port ${ENV.PORT}`, {
    environment: ENV.NODE_ENV,
    port: ENV.PORT,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');

  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');

  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export { app, server };
