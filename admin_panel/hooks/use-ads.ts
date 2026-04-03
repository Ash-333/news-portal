'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Advertisement, ApiResponse, PaginationInfo } from '@/types'

interface AdsResponse {
  data: Advertisement[]
  pagination: PaginationInfo
}

const fetchAds = async (page: number = 1): Promise<AdsResponse> => {
  const response = await fetch(`/api/admin/ads?page=${page}`)
  const result: ApiResponse<Advertisement[]> = await response.json()
  if (!result.success) throw new Error(result.message)
  return { data: result.data, pagination: result.pagination! }
}

const createAd = async (data: FormData): Promise<Advertisement> => {
  // First upload the media file
  const mediaResponse = await fetch('/api/admin/media', { method: 'POST', body: data })
  const mediaResult = await mediaResponse.json()

  if (!mediaResult.success) throw new Error(mediaResult.message || 'Failed to upload media')

  // Then create the ad with the media URL
  const adData = {
    titleNe: data.get('titleNe') as string,
    titleEn: data.get('titleEn') as string,
    mediaUrl: mediaResult.data.url,
    mediaType: (data.get('file') as File)?.type?.includes('gif') ? 'GIF' : 'IMAGE',
    linkUrl: data.get('linkUrl') as string || '',
    position: data.get('position') as string || 'SIDEBAR',
    isActive: true,
  }

  const response = await fetch('/api/admin/ads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adData),
  })
  const result: ApiResponse<Advertisement> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

const toggleAdActive = async ({ id, isActive }: { id: string; isActive: boolean }): Promise<Advertisement> => {
  const response = await fetch(`/api/admin/ads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  })
  const result: ApiResponse<Advertisement> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

const deleteAd = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' })
  const result: ApiResponse<null> = await response.json()
  if (!result.success) throw new Error(result.message)
}

export function useAds(page: number = 1) {
  return useQuery({
    queryKey: ['ads', page],
    queryFn: () => fetchAds(page),
  })
}

export function useCreateAd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

export function useToggleAdActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleAdActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

export function useDeleteAd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}
