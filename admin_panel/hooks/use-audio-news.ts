'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiResponse, PaginationInfo } from '@/types'

export interface AudioNews {
  id: string
  titleNe: string
  titleEn: string
  descriptionNe?: string
  descriptionEn?: string
  audioUrl: string
  thumbnailUrl?: string
  categoryId?: string
  category?: { id: string; nameNe: string; nameEn: string }
  authorId: string
  author: { id: string; name: string }
  isPublished: boolean
  viewCount: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface AudioNewsParams {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  isPublished?: boolean
}

interface AudioNewsResponse {
  data: AudioNews[]
  pagination: PaginationInfo
}

const fetchAudioNews = async (params: AudioNewsParams = {}): Promise<AudioNewsResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)
  if (params.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params.isPublished !== undefined) searchParams.set('isPublished', params.isPublished.toString())

  const response = await fetch(`/api/admin/audio-news?${searchParams}`)
  const result: ApiResponse<AudioNews[]> = await response.json()
  if (!result.success) throw new Error(result.message)
  return { data: result.data, pagination: result.pagination! }
}

const createAudioNews = async (data: {
  titleNe: string
  titleEn: string
  descriptionNe?: string
  descriptionEn?: string
  audioUrl: string
  thumbnailUrl?: string
  categoryId?: string
  isPublished?: boolean
}): Promise<AudioNews> => {
  const response = await fetch('/api/admin/audio-news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<AudioNews> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

const updateAudioNews = async ({ id, ...data }: Partial<AudioNews> & { id: string }): Promise<AudioNews> => {
  const response = await fetch(`/api/admin/audio-news/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<AudioNews> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

const deleteAudioNews = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/audio-news/${id}`, { method: 'DELETE' })
  const result: ApiResponse<null> = await response.json()
  if (!result.success) throw new Error(result.message)
}

const togglePublishAudioNews = async ({ id, isPublished }: { id: string; isPublished: boolean }): Promise<AudioNews> => {
  const response = await fetch(`/api/admin/audio-news/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isPublished }),
  })
  const result: ApiResponse<AudioNews> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

export function useAudioNews(params: AudioNewsParams = {}) {
  return useQuery({
    queryKey: ['audioNews', params],
    queryFn: () => fetchAudioNews(params),
  })
}

export function useCreateAudioNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAudioNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioNews'] })
    },
  })
}

export function useUpdateAudioNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAudioNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioNews'] })
    },
  })
}

export function useDeleteAudioNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAudioNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioNews'] })
    },
  })
}

export function useTogglePublishAudioNews() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: togglePublishAudioNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioNews'] })
    },
  })
}