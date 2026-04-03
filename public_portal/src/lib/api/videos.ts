import { ApiResponse, VideoUpdate } from '@/types';
import { apiFetch } from './client';

export interface VideoParams {
  page?: number;
  limit?: number;
}

export function getVideos(params: VideoParams = {}): Promise<ApiResponse<VideoUpdate[]>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const endpoint = `/api/videos${qs ? `?${qs}` : ''}`;
  return apiFetch<VideoUpdate[]>(endpoint, { method: 'GET' });
}
