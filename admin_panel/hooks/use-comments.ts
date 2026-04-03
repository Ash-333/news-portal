'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Comment, CommentWithRelations, CommentStatus, ApiResponse, PaginationInfo } from '@/types'

interface CommentsParams {
  page?: number
  limit?: number
  status?: CommentStatus
  articleId?: string
  search?: string
}

interface CommentsResponse {
  data: CommentWithRelations[]
  pagination: PaginationInfo
}

const fetchComments = async (params: CommentsParams = {}): Promise<CommentsResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.status) searchParams.set('status', params.status)
  if (params.articleId) searchParams.set('articleId', params.articleId)
  if (params.search) searchParams.set('search', params.search)

  const response = await fetch(`/api/admin/comments?${searchParams}`)
  const result: ApiResponse<CommentWithRelations[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return {
    data: result.data,
    pagination: result.pagination!,
  }
}

const updateCommentStatus = async ({ id, status }: { id: string; status: CommentStatus }): Promise<Comment> => {
  const response = await fetch(`/api/admin/comments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const result: ApiResponse<Comment> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const deleteComment = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/comments/${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<null> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
}

// Hooks
export function useComments(params: CommentsParams = {}) {
  return useQuery({
    queryKey: ['comments', params],
    queryFn: () => fetchComments(params),
  })
}

export function useUpdateCommentStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateCommentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
