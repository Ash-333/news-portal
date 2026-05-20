import { ApiResponse, VideoUpdate } from '@/types';
import { apiFetch } from './client';

export interface VideoParams {
  page?: number;
  limit?: number;
  isLivestream?: boolean;
}

export function getVideos(params: VideoParams = {}): Promise<ApiResponse<VideoUpdate[]>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.isLivestream) query.set('isLivestream', 'true');

  const qs = query.toString();
  const endpoint = `/api/videos${qs ? `?${qs}` : ''}`;
  return apiFetch<VideoUpdate[]>(endpoint, { method: 'GET' });
}

export function getFeaturedLivestream(): Promise<ApiResponse<VideoUpdate | null>> {
  return apiFetch<VideoUpdate | null>('/api/videos?isFeaturedLivestream=true', { method: 'GET' });
}
