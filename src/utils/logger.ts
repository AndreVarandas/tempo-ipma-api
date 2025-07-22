import winston from 'winston';
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
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

if (!isDevelopment()) {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  );
}
