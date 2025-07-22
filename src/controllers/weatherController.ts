import { Request, Response } from 'express';
import { ipmaService } from '../services/ipmaService';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { APIResponse } from '../types/ipma';
import { logger } from '../utils/logger';

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
export const healthCheck = (_req: Request, res: Response): void => {
  const response: APIResponse<{ timestamp: string; status: string }> = {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  };

  res.json(response);
};

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get all Portuguese locations and districts
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of all available locations
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Location'
 *                     count:
 *                       type: integer
 *                       example: 35
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const getLocations = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  logger.info('Fetching all locations');

  const locations = await ipmaService.getLocations();

  const response: APIResponse<typeof locations> = {
    success: true,
    data: locations,
    count: locations.length,
  };

  res.json(response);
});

/**
 * @swagger
 * /weather-types:
 *   get:
 *     summary: Get weather type classifications
 *     tags: [Weather Types]
 *     responses:
 *       200:
 *         description: List of weather type classifications
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WeatherType'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const getWeatherTypes = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  logger.info('Fetching weather types');

  const weatherTypes = await ipmaService.getWeatherTypes();

  const response: APIResponse<typeof weatherTypes> = {
    success: true,
    data: weatherTypes,
  };

  res.json(response);
});

/**
 * @swagger
 * /forecast/current:
 *   get:
 *     summary: Get current day forecast for all locations
 *     tags: [Forecasts]
 *     responses:
 *       200:
 *         description: Current forecast data for all Portuguese locations
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ForecastData'
 *                     count:
 *                       type: integer
 *                       example: 27
 *                     metadata:
 *                       type: object
 *                       properties:
 *                         forecastDate:
 *                           type: string
 *                           format: date
 *                         dataUpdate:
 *                           type: string
 *                           format: date-time
 *                         owner:
 *                           type: string
 *                           example: "IPMA"
 *                         country:
 *                           type: string
 *                           example: "PT"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /forecast/daily:
 *   get:
 *     summary: Get current day forecast for all locations (alias)
 *     tags: [Forecasts]
 *     responses:
 *       200:
 *         description: Same as /forecast/current
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ForecastData'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const getCurrentForecast = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    logger.info('Fetching current forecast for all locations');

    const enhanced = await ipmaService.getEnhancedCurrentForecast();

    const response: APIResponse<typeof enhanced.data> = {
      success: true,
      metadata: enhanced.metadata,
      data: enhanced.data,
      count: enhanced.data.length,
    };

    res.json(response);
  }
);

/**
 * @swagger
 * /forecast/daily/{locationId}:
 *   get:
 *     summary: Get forecast for a specific location
 *     tags: [Forecasts]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         description: Global location identifier
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1010500
 *     responses:
 *       200:
 *         description: Forecast data for the specified location
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ForecastData'
 *                     count:
 *                       type: integer
 *                       example: 1
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const getForecastByLocation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const locationId = parseInt(req.params.locationId, 10);

    logger.info(`Fetching forecast for location ${locationId}`);

    const forecast = await ipmaService.getForecastByLocation(locationId);

    if (!forecast) {
      throw new AppError('Location not found', 404);
    }

    const enhanced = await ipmaService.getEnhancedCurrentForecast();

    const response: APIResponse<typeof forecast> = {
      success: true,
      metadata: enhanced.metadata,
      data: forecast,
      count: 1,
    };

    res.json(response);
  }
);

/**
 * @swagger
 * /cache:
 *   delete:
 *     summary: Clear service cache
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/APIResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Cache cleared successfully"
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const clearCache = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  logger.info('Clearing service cache');

  ipmaService.clearCache();

  const response: APIResponse<{ message: string }> = {
    success: true,
    data: {
      message: 'Cache cleared successfully',
    },
  };

  res.json(response);
});
