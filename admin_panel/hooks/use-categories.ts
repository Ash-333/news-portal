'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Category, CategoryWithChildren, ApiResponse } from '@/types'

const fetchCategories = async (): Promise<CategoryWithChildren[]> => {
  const response = await fetch('/api/admin/categories')
  const result: ApiResponse<CategoryWithChildren[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const createCategory = async (data: { nameNe: string; nameEn: string; slug: string; parentId?: string }): Promise<Category> => {
  const response = await fetch('/api/admin/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<Category> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const updateCategory = async ({ id, data }: { id: string; data: Partial<Category> }): Promise<Category> => {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<Category> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const deleteCategory = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<null> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
}

// Hooks
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
