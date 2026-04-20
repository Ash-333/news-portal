import { apiFetch } from './client';
import type { ApiResponse, Pagination } from '@/types';

export interface PhotoGalleryMedia {
  id: string;
  filename: string;
  url: string;
  type: string;
  altText?: string;
}

export interface PhotoGalleryPhoto {
  id: string;
  order: number;
  captionNe?: string;
  captionEn?: string;
  media: PhotoGalleryMedia;
}

export interface PhotoGallery {
  id: string;
  titleNe: string;
  titleEn: string;
  excerptNe?: string;
  excerptEn?: string;
  slug: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  coverImage?: {
    id: string;
    url: string;
    filename: string;
  } | null;
  author: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  photos: PhotoGalleryPhoto[];
}

export interface PhotoGalleriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getPhotoGalleries(params: PhotoGalleriesParams = {}): Promise<{ data: PhotoGallery[], pagination: any }> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', params.page.toString());
  if (params.limit) qs.set('limit', params.limit.toString());
  if (params.search) qs.set('search', params.search);

  const endpoint = `/api/photo-galleries${qs ? `?${qs}` : ''}`;
  const response: ApiResponse<{ data: PhotoGallery[], pagination: any }> = await apiFetch(endpoint, {
    method: 'GET',
    next: { revalidate: 300 },
  });

  if (Array.isArray(response.data)) {
    return { data: response.data, pagination: { page: params.page || 1, limit: params.limit || 12, total: response.data.length, totalPages: 1 } };
  }
  return response.data;
}

export function getPhotoGalleryBySlug(
  slug: string,
  options?: { revalidate?: number }
): Promise<ApiResponse<PhotoGallery>> {
  return apiFetch<PhotoGallery>(`/api/photo-galleries/${slug}`, {
    method: 'GET',
    next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
  });
}

export async function fetchPhotoGalleryBySlug(
  slug: string,
  options?: { revalidate?: number }
): Promise<PhotoGallery | null> {
  const response = await getPhotoGalleryBySlug(slug, options);
  return response.success ? response.data : null;
}

export async function getPhotoGalleriesForHomepage(
  limit = 4
): Promise<PhotoGallery[]> {
  const result = await getPhotoGalleries({ limit, page: 1 });
  return result.data;
}
