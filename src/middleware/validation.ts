import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateLocationId = (req: Request, _res: Response, next: NextFunction): void => {
  const { locationId } = req.params;

  if (locationId) {
    const id = parseInt(locationId, 10);

    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid location ID. Must be a positive integer.', 400);
    }

    // Store the parsed ID for use in the controller
    req.params.locationId = id.toString();
  }

  next();
};
