'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Article, ArticleWithRelations, ArticleStatus, ApiResponse, PaginationInfo } from '@/types'
import type { ArticleFormData } from '@/lib/validations'

type ArticlePayload = Omit<ArticleFormData, 'tagIds'> & {
  tagIds?: string[]
}

interface ArticlesParams {
  page?: number
  limit?: number
  status?: ArticleStatus
  search?: string
  categoryId?: string
}

interface ArticlesResponse {
  data: ArticleWithRelations[]
  pagination: PaginationInfo
}

const fetchArticles = async (params: ArticlesParams = {}): Promise<ArticlesResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.status) searchParams.set('status', params.status)
  if (params.search) searchParams.set('search', params.search)
  if (params.categoryId) searchParams.set('categoryId', params.categoryId)

  const response = await fetch(`/api/admin/articles?${searchParams}`)
  const result: ApiResponse<ArticleWithRelations[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return {
    data: result.data,
    pagination: result.pagination!,
  }
}

const fetchArticle = async (id: string): Promise<ArticleWithRelations> => {
  const response = await fetch(`/api/admin/articles/${id}`)
  const result: ApiResponse<ArticleWithRelations> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

// Public article type (for /articles/[slug])
interface PublicArticle {
  id: string
  titleNe: string
  titleEn: string
  contentNe: string
  contentEn: string
  excerptNe?: string
  excerptEn?: string
  slug: string
  isFlashUpdate: boolean
  isFeatured: boolean
  publishedAt?: Date
  viewCount: number
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  featuredImage?: {
    id: string
    url: string
  } | null
  author: {
    id: string
    name: string
    profilePhoto?: string
    bio?: string
  }
  category: {
    id: string
    nameNe: string
    nameEn: string
    slug: string
  }
  tags: {
    id: string
    nameNe: string
    nameEn: string
    slug: string
  }[]
  comments: number
}

const fetchPublicArticle = async (slug: string): Promise<PublicArticle> => {
  const response = await fetch(`/api/articles/${slug}`)
  const result: ApiResponse<PublicArticle> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const createArticle = async (data: ArticlePayload): Promise<Article> => {
  const response = await fetch('/api/admin/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<Article> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const updateArticle = async ({ id, data }: { id: string; data: ArticlePayload }): Promise<Article> => {
  const response = await fetch(`/api/admin/articles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<Article> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const deleteArticle = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/articles/${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<null> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
}

const updateArticleStatus = async ({ id, status }: { id: string; status: ArticleStatus }): Promise<Article> => {
  const response = await fetch(`/api/admin/articles/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const result: ApiResponse<Article> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

// Hooks
export function useArticles(params: ArticlesParams = {}) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => fetchArticles(params),
  })
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticle(id),
    enabled: !!id,
  })
}

export function usePublicArticle(slug: string) {
  return useQuery({
    queryKey: ['publicArticle', slug],
    queryFn: () => fetchPublicArticle(slug),
    enabled: !!slug,
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useUpdateArticle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateArticle,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['article', variables.id] })
    },
  })
}

export function useDeleteArticle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateArticleStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['article', variables.id] })
    },
  })
}

// Submit article for review
export function useSubmitForReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/articles/${id}/submit-review`, {
        method: 'PATCH',
      })
      const result: ApiResponse<Article> = await response.json()
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      return result.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      queryClient.invalidateQueries({ queryKey: ['article', id] })
    },
  })
}
