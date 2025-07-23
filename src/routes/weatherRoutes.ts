import { Router } from 'express';
import {
  healthCheck,
  getLocations,
  getWeatherTypes,
  getForecast,
  clearCache,
} from '../controllers/weatherController';

const router = Router();

// Health check
router.get('/health', healthCheck);

// Locations and metadata
router.get('/locations', getLocations);
router.get('/weather-types', getWeatherTypes);

// Unified forecast endpoint
router.get('/forecast', getForecast);

// Cache management
router.delete('/cache', clearCache);

export { router as weatherRoutes };
