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

export async function flashUpdates(params: FlashUpdateParams = {}): Promise<FlashUpdate[]> {
  const response = await getFlashUpdates(params);
  return response.success ? response.data : [];
}

export function getFlashUpdateBySlug(slug: string): Promise<ApiResponse<FlashUpdate>> {
  return apiFetch<FlashUpdate>(`/api/flash-updates/${slug}`, { method: 'GET' });
}

export async function fetchFlashUpdateBySlug(slug: string): Promise<FlashUpdate | null> {
  const response = await getFlashUpdateBySlug(slug);
  return response.success ? response.data : null;
}
