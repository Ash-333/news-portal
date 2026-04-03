import { ApiResponse, WeatherData, Match, MarketData } from '@/types';
import { apiFetch } from './client';

export function getWeather(): Promise<ApiResponse<WeatherData>> {
  return apiFetch<WeatherData>('/api/weather', { method: 'GET' });
}

export function getMatches(): Promise<ApiResponse<Match[]>> {
  return apiFetch<Match[]>('/api/matches', { method: 'GET' });
}

export function getMarketData(): Promise<ApiResponse<MarketData>> {
  return apiFetch<MarketData>('/api/market-data', { method: 'GET' });
}
