import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ENV, isDevelopment } from '../config/environment';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const devFormat = winston.format.combine(winston.format.colorize(), winston.format.simple());

export const logger = winston.createLogger({
  level: ENV.LOG_LEVEL,
  format: isDevelopment() ? devFormat : logFormat,
  defaultMeta: { service: 'ipma-api-wrapper' },
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
  ],
});
