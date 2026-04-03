'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FlashUpdate, ApiResponse, PaginationInfo } from '@/types'

interface FlashUpdatesParams {
  page?: number
  limit?: number
  search?: string
  isPublished?: boolean
  activeOnly?: boolean
}

interface FlashUpdatesResponse {
  data: FlashUpdate[]
  pagination: PaginationInfo
}

const fetchFlashUpdates = async (params: FlashUpdatesParams = {}): Promise<FlashUpdatesResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)
  if (params.activeOnly) searchParams.set('activeOnly', 'true')

  const response = await fetch(`/api/admin/flash-updates?${searchParams}`)
  const result: ApiResponse<FlashUpdate[]> = await response.json()
  if (!result.success) throw new Error(result.message)
  return { data: result.data, pagination: result.pagination! }
}

const createFlashUpdate = async (data: Record<string, unknown>): Promise<FlashUpdate> => {
  const response = await fetch('/api/admin/flash-updates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<FlashUpdate> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

const deleteFlashUpdate = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/flash-updates/${id}`, { method: 'DELETE' })
  const result: ApiResponse<null> = await response.json()
  if (!result.success) throw new Error(result.message)
}

const fetchFlashUpdate = async (id: string): Promise<FlashUpdate> => {
  const response = await fetch(`/api/admin/flash-updates/${id}`)
  const result: ApiResponse<FlashUpdate> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

const updateFlashUpdate = async ({ id, data }: { id: string; data: Record<string, unknown> }): Promise<FlashUpdate> => {
  const response = await fetch(`/api/admin/flash-updates/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<FlashUpdate> = await response.json()
  if (!result.success) throw new Error(result.message)
  return result.data
}

export function useFlashUpdates(params: FlashUpdatesParams = {}) {
  return useQuery({
    queryKey: ['flash-updates', params],
    queryFn: () => fetchFlashUpdates(params),
  })
}

export function useCreateFlashUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFlashUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-updates'] })
    },
  })
}

export function useDeleteFlashUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFlashUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flash-updates'] })
    },
  })
}

export function useFlashUpdate(id: string) {
  return useQuery({
    queryKey: ['flash-update', id],
    queryFn: () => fetchFlashUpdate(id),
    enabled: !!id,
  })
}

export function useUpdateFlashUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateFlashUpdate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flash-updates'] })
      queryClient.invalidateQueries({ queryKey: ['flash-update', variables.id] })
    },
  })
}
