import { Request, Response } from 'express';
import { ipmaService } from '../services/ipmaService';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { APIResponse } from '../types/ipma';
import { logger } from '../utils/logger';

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

export const getWeatherTypes = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  logger.info('Fetching weather types');

  const weatherTypes = await ipmaService.getWeatherTypes();

  const response: APIResponse<typeof weatherTypes> = {
    success: true,
    data: weatherTypes,
  };

  res.json(response);
});

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
