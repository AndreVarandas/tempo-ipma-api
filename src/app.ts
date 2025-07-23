import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { weatherRoutes } from './routes/weatherRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { getSwaggerSpec } from './config/swaggerSimple';

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
  app.use(
    '/api-docs',
    swaggerUi.serve,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const spec = getSwaggerSpec(req);
      return swaggerUi.setup(spec)(req, res, next);
    }
  );

  // Swagger JSON endpoint
  app.get('/api-docs.json', (req: express.Request, res: express.Response) => {
    const spec = getSwaggerSpec(req);
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
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
