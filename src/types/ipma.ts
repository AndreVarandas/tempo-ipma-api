export interface IPMALocation {
  regionId: number;
  idWarning: number;
  idMunicipio: number;
  globalIdLocal: number;
  latitude: number;
  longitude: number;
  idDistrito: number;
  local: string;
  dico?: string;
}

export interface IPMAWeatherType {
  idWeatherType: number;
  descIdWeatherTypePT: string;
  descIdWeatherTypeEN: string;
}

export interface IPMAForecastData {
  precipitaProb: number;
  tMin: number;
  tMax: number;
  predWindDir: string;
  idWeatherType: number;
  classWindSpeed: number;
  longitude: number;
  latitude: number;
  globalIdLocal: number;
}

export interface IPMAForecastResponse {
  owner: string;
  country: string;
  forecastDate: string;
  dataUpdate: string;
  data: IPMAForecastData[];
}

export interface EnhancedForecastData extends IPMAForecastData {
  locationName: string;
  district: string | null;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  metadata?: {
    forecastDate?: string;
    dataUpdate?: string;
    owner?: string;
    country?: string;
  };
  count?: number;
  error?: string;
}

export interface IPMALocationResponse {
  data: IPMALocation[];
}

export interface IPMAWeatherTypeResponse {
  data: IPMAWeatherType[];
}
