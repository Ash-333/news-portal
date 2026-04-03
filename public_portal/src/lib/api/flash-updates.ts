import { ApiResponse, FlashUpdate } from '@/types';
import { apiFetch } from './client';

export interface FlashUpdateParams {
  page?: number;
  limit?: number;
}

export function getFlashUpdates(params: FlashUpdateParams = {}): Promise<ApiResponse<FlashUpdate[]>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const endpoint = `/api/flash-updates${qs ? `?${qs}` : ''}`;
  return apiFetch<FlashUpdate[]>(endpoint, { method: 'GET' });
}

export function getFlashUpdateBySlug(slug: string): Promise<ApiResponse<FlashUpdate>> {
  return apiFetch<FlashUpdate>(`/api/flash-updates/${slug}`, { method: 'GET' });
}
