import { ApiResponse, Poll } from '@/types';
import { apiFetch } from './client';

export function getPolls(): Promise<ApiResponse<Poll[]>> {
  return apiFetch<Poll[]>('/api/polls', { method: 'GET' });
}

export function getPoll(id: string): Promise<ApiResponse<Poll>> {
  return apiFetch<Poll>(`/api/polls/${id}`, { method: 'GET' });
}

export function votePoll(
  pollId: string, 
  optionId: string, 
  sessionToken?: string
): Promise<ApiResponse<Poll>> {
  return apiFetch<Poll>(`/api/polls/${pollId}`, {
    method: 'POST',
    body: JSON.stringify({ optionId, sessionToken }),
  });
}

export function getPollResults(id: string): Promise<ApiResponse<Poll>> {
  return apiFetch<Poll>(`/api/polls/${id}/results`, { method: 'GET' });
}