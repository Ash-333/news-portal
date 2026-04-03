import { ApiResponse, Comment } from '@/types';
import { apiFetch } from './client';

export function getComments(articleId: string): Promise<ApiResponse<Comment[]>> {
  return apiFetch<Comment[]>(`/api/articles/${articleId}/comments`, { method: 'GET' });
}

export function postComment(body: Record<string, unknown>): Promise<ApiResponse<Comment>> {
  return apiFetch<Comment>('/api/comments', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function likeComment(id: string): Promise<ApiResponse<{ likesCount: number; liked: boolean }>> {
  return apiFetch<{ likesCount: number; liked: boolean }>(`/api/comments/${id}/like`, {
    method: 'POST',
  });
}

export async function reportComment(id: string, reason: string): Promise<void> {
  await apiFetch<null>(`/api/comments/${id}/report`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function deleteComment(id: string): Promise<void> {
  await apiFetch<null>(`/api/comments/${id}`, { method: 'DELETE' });
}
