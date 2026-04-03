import { ApiResponse, Category } from '@/types';
import { apiFetch } from './client';

export function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiFetch<Category[]>('/api/categories', { method: 'GET' });
}

export function getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
  return apiFetch<Category>(`/api/categories/${slug}`, { method: 'GET' });
}
