import axios, { AxiosResponse } from 'axios';
import { ENV } from '../config/environment';
import { logger } from '../utils/logger';
import {
  IPMALocation,
  IPMAWeatherType,
  IPMAForecastResponse,
  IPMALocationResponse,
  IPMAWeatherTypeResponse,
  EnhancedForecastData,
} from '../types/ipma';

class IPMAService {
  private readonly baseURL = ENV.IPMA_BASE_URL;
  private locationsCache: IPMALocation[] | null = null;
  private weatherTypesCache: IPMAWeatherType[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      logger.info(`Fetching data from ${endpoint}`);
      const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch data from ${endpoint}:`, error);
      throw new Error(`Failed to fetch data from IPMA API: ${endpoint}`);
    }
  }

  private isCacheValid(): boolean {
    return this.cacheTimestamp > 0 && Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
  }

  async getLocations(): Promise<IPMALocation[]> {
    if (!this.locationsCache || !this.isCacheValid()) {
      logger.info('Fetching locations data from IPMA');
      const response = await this.fetchData<IPMALocationResponse>('/distrits-islands.json');
      this.locationsCache = response.data;
      this.cacheTimestamp = Date.now();
    } else {
      logger.debug('Using cached locations data');
    }

    return this.locationsCache;
  }

  async getWeatherTypes(): Promise<IPMAWeatherType[]> {
    if (!this.weatherTypesCache || !this.isCacheValid()) {
      logger.info('Fetching weather types data from IPMA');
      const response = await this.fetchData<IPMAWeatherTypeResponse>('/weather-type-classe.json');
      this.weatherTypesCache = response.data;
    } else {
      logger.debug('Using cached weather types data');
    }

    return this.weatherTypesCache;
  }

  async getCurrentForecast(): Promise<IPMAForecastResponse> {
    logger.info('Fetching current forecast data from IPMA');
    return await this.fetchData<IPMAForecastResponse>(
      '/forecast/meteorology/cities/daily/hp-daily-forecast-day0.json'
    );
  }

  async getForecastByDay(day: number): Promise<IPMAForecastResponse> {
    if (day < 0 || day > 2) {
      throw new Error('Day must be between 0 and 2');
    }
    logger.info(`Fetching day ${day} forecast data from IPMA`);
    return await this.fetchData<IPMAForecastResponse>(
      `/forecast/meteorology/cities/daily/hp-daily-forecast-day${day}.json`
    );
  }

  async getEnhancedCurrentForecast(): Promise<{
    metadata: IPMAForecastResponse['owner'] extends string
      ? Pick<IPMAForecastResponse, 'owner' | 'country' | 'forecastDate' | 'dataUpdate'>
      : never;
    data: EnhancedForecastData[];
  }> {
    return this.getEnhancedForecastByDay(0);
  }

  async getEnhancedForecastByDay(day: number): Promise<{
    metadata: IPMAForecastResponse['owner'] extends string
      ? Pick<IPMAForecastResponse, 'owner' | 'country' | 'forecastDate' | 'dataUpdate'>
      : never;
    data: EnhancedForecastData[];
  }> {
    const [forecastResponse, locations] = await Promise.all([
      this.getForecastByDay(day),
      this.getLocations(),
    ]);

    const enhancedData: EnhancedForecastData[] = forecastResponse.data.map(forecast => {
      const location = locations.find(loc => loc.globalIdLocal === forecast.globalIdLocal);
      return {
        ...forecast,
        locationName: location?.local || 'Unknown',
        district: location?.dico || null,
      };
    });

    return {
      metadata: {
        forecastDate: forecastResponse.forecastDate,
        dataUpdate: forecastResponse.dataUpdate,
        owner: forecastResponse.owner,
        country: forecastResponse.country,
      },
      data: enhancedData,
    };
  }

  async getForecastByLocation(
    locationId: number,
    day: number = 0
  ): Promise<EnhancedForecastData | null> {
    const enhanced = await this.getEnhancedForecastByDay(day);
    const forecast = enhanced.data.find(f => f.globalIdLocal === locationId);
    return forecast || null;
  }

  clearCache(): void {
    logger.info('Clearing IPMA service cache');
    this.locationsCache = null;
    this.weatherTypesCache = null;
    this.cacheTimestamp = 0;
  }
}

export const ipmaService = new IPMAService();
