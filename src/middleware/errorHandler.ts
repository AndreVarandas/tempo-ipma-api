import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { APIResponse } from '../types/ipma';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (error: Error | AppError, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  }

  logger.error('Error handled:', {
    message: error.message,
    stack: error.stack,
    statusCode,
  });

  const response: APIResponse<never> = {
    success: false,
    error: message,
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  const response: APIResponse<never> = {
    success: false,
    error: 'Endpoint not found',
  };

  res.status(404).json(response);
};

export const asyncHandler = <T extends unknown[], R>(
  fn: (req: Request, res: Response, next: NextFunction, ...args: T) => Promise<R>
) => {
  return (req: Request, res: Response, next: NextFunction, ...args: T): void => {
    Promise.resolve(fn(req, res, next, ...args)).catch(next);
  };
};
