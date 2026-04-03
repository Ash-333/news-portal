import { ApiResponse, AdWithPosition, AdPosition } from '@/types';
import { apiFetch } from './client';

export function getAdsByPosition(position: AdPosition): Promise<ApiResponse<AdWithPosition[]>> {
  return apiFetch<AdWithPosition[]>(`/api/ads?position=${position}`, { method: 'GET' });
}

export function getAds(position?: AdPosition): Promise<ApiResponse<AdWithPosition[]>> {
  const endpoint = position ? `/api/ads?position=${position}` : '/api/ads';
  return apiFetch<AdWithPosition[]>(endpoint, { method: 'GET' });
}

export function trackAdClick(adId: string): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>(`/api/ads/${adId}/click`, {
    method: 'POST',
  });
}

export function getRandomAd(position: AdPosition): Promise<ApiResponse<AdWithPosition | null>> {
  return apiFetch<AdWithPosition | null>(`/api/ads/random?position=${position}`, { method: 'GET' });
}
