import { Router } from 'express';
import {
  healthCheck,
  getLocations,
  getWeatherTypes,
  getCurrentForecast,
  getForecastByLocation,
  clearCache,
} from '../controllers/weatherController';
import { validateLocationId } from '../middleware/validation';

const router = Router();

// Health check
router.get('/health', healthCheck);

// Locations and metadata
router.get('/locations', getLocations);
router.get('/weather-types', getWeatherTypes);

// Forecast endpoints
router.get('/forecast/current', getCurrentForecast);
router.get('/forecast/daily', getCurrentForecast);
router.get('/forecast/daily/:locationId', validateLocationId, getForecastByLocation);

// Cache management
router.delete('/cache', clearCache);

export { router as weatherRoutes };
