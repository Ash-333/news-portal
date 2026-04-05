'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tag, ApiResponse } from '@/types'

const fetchTags = async (search?: string): Promise<Tag[]> => {
  const url = search ? `/api/admin/tags?search=${encodeURIComponent(search)}` : '/api/admin/tags'
  const response = await fetch(url)
  const result: ApiResponse<Tag[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const createTag = async (data: { nameNe: string; nameEn: string; slug: string }): Promise<Tag> => {
  const response = await fetch('/api/admin/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<Tag> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const updateTag = async ({ id, data }: { id: string; data: Partial<Tag> }): Promise<Tag> => {
  const response = await fetch(`/api/admin/tags/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<Tag> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const deleteTag = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/tags/${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<null> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
}

// Hooks
export function useTags(search?: string) {
  return useQuery({
    queryKey: ['tags', search],
    queryFn: () => fetchTags(search),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}