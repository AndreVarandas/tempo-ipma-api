import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { weatherRoutes } from './routes/weatherRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { swaggerSpec } from './config/swaggerSimple';

export const createApp = (): express.Application => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    next();
  });

  // API Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Swagger JSON endpoint
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Routes
  app.use('/api/v1', weatherRoutes);
  app.use('/', weatherRoutes); // Backwards compatibility

  // Error handling
  app.use(errorHandler);

  // 404 handler for unmatched routes
  app.use(notFoundHandler);

  return app;
};
