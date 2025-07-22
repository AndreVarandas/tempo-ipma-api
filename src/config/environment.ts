import { config } from 'dotenv';

config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IPMA_BASE_URL: 'https://api.ipma.pt/open-data',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

export const isDevelopment = (): boolean => ENV.NODE_ENV === 'development';
export const isProduction = (): boolean => ENV.NODE_ENV === 'production';
