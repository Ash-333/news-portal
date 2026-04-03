'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Video, ApiResponse, PaginationInfo } from '@/types'

interface VideosParams {
  page?: number
  limit?: number
  search?: string
  isPublished?: boolean
}

interface VideosResponse {
  data: Video[]
  pagination: PaginationInfo
}

const fetchVideos = async (params: VideosParams = {}): Promise<VideosResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)
  if (params.isPublished !== undefined) searchParams.set('isPublished', params.isPublished.toString())

  const response = await fetch(`/api/admin/videos?${searchParams}`)
  const result: ApiResponse<Video[]> = await response.json()
  if (!result.success) throw new Error(result.message)
  return { data: result.data, pagination: result.pagination! }
}

const createVideo = async (data: { titleNe: string; titleEn: string; youtubeUrl: string }): Promise<Video> => {
  const response = await fetch('/api/admin/videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<Video> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

const deleteVideo = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' })
  const result: ApiResponse<null> = await response.json()
  if (!result.success) throw new Error(result.message)
}

const togglePublishVideo = async ({ id, isPublished }: { id: string; isPublished: boolean }): Promise<Video> => {
  const response = await fetch(`/api/admin/videos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isPublished }),
  })
  const result: ApiResponse<Video> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

export function useVideos(params: VideosParams = {}) {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => fetchVideos(params),
  })
}

export function useCreateVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export function useTogglePublishVideo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: togglePublishVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}
