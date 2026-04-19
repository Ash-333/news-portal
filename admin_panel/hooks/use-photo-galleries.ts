'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PhotoGallery, PhotoGalleryWithRelations, ApiResponse, PaginationInfo } from '@/types'
import type { PhotoGalleryFormData } from '@/lib/validations'

type PhotoGalleryPayload = Omit<PhotoGalleryFormData, 'tagIds'> & {
  isPublished?: boolean
}

interface PhotoGalleriesParams {
  page?: number
  limit?: number
  search?: string
}

interface PhotoGalleriesResponse {
  data: PhotoGalleryWithRelations[]
  pagination: PaginationInfo
}

const fetchPhotoGalleries = async (params: PhotoGalleriesParams = {}): Promise<PhotoGalleriesResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)

  const response = await fetch(`/api/admin/photo-galleries?${searchParams}`)
  const result: ApiResponse<PhotoGalleryWithRelations[]> = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }

  return {
    data: result.data,
    pagination: result.pagination!,
  }
}

const fetchPhotoGallery = async (id: string): Promise<PhotoGalleryWithRelations> => {
  const response = await fetch(`/api/admin/photo-galleries/${id}`)
  const result: ApiResponse<PhotoGalleryWithRelations> = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data
}

const createPhotoGallery = async (data: PhotoGalleryPayload): Promise<PhotoGallery> => {
  const response = await fetch('/api/admin/photo-galleries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<PhotoGallery> = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data
}

const updatePhotoGallery = async ({ id, data }: { id: string; data: PhotoGalleryPayload }): Promise<PhotoGallery> => {
  const response = await fetch(`/api/admin/photo-galleries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<PhotoGallery> = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data
}

const deletePhotoGallery = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/photo-galleries/${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<null> = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }
}

const publishPhotoGallery = async (id: string): Promise<PhotoGallery> => {
  const response = await fetch(`/api/admin/photo-galleries/${id}/publish`, {
    method: 'PATCH',
  })
  const result: ApiResponse<PhotoGallery> = await response.json()

  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data
}

// Hooks
export function usePhotoGalleries(params: PhotoGalleriesParams = {}) {
  return useQuery({
    queryKey: ['photo-galleries', params],
    queryFn: () => fetchPhotoGalleries(params),
  })
}

export function usePhotoGallery(id: string) {
  return useQuery({
    queryKey: ['photo-gallery', id],
    queryFn: () => fetchPhotoGallery(id),
    enabled: !!id,
  })
}

export function useCreatePhotoGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPhotoGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-galleries'] })
    },
  })
}

export function useUpdatePhotoGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePhotoGallery,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['photo-galleries'] })
      queryClient.invalidateQueries({ queryKey: ['photo-gallery', variables.id] })
    },
  })
}

export function useDeletePhotoGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePhotoGallery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-galleries'] })
    },
  })
}

export function usePublishPhotoGallery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: publishPhotoGallery,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['photo-galleries'] })
      queryClient.invalidateQueries({ queryKey: ['photo-gallery', id] })
    },
  })
}
