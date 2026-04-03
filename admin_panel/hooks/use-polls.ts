import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Poll, PollWithOptions, PollFormData } from '@/types'

const API_BASE = '/api'

// Admin Hooks

export function usePolls(filters?: { isActive?: boolean; search?: string }) {
  const queryParams = new URLSearchParams()
  if (filters?.isActive !== undefined) queryParams.set('isActive', String(filters.isActive))
  if (filters?.search) queryParams.set('search', filters.search)

  return useQuery<Poll[]>({
    queryKey: ['polls', filters],
    queryFn: () => fetch(`${API_BASE}/admin/polls?${queryParams}`).then(res => res.json()).then(data => data.success ? data.data : []),
  })
}

export function usePoll(id: string) {
  return useQuery<PollWithOptions>({
    queryKey: ['poll', id],
    queryFn: () => fetch(`${API_BASE}/admin/polls/${id}`).then(res => res.json()).then(data => data.success ? data.data : null),
    enabled: !!id,
  })
}

export function useCreatePoll() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: PollFormData) => {
      const response = await fetch(`${API_BASE}/admin/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    },
  })
}

export function useUpdatePoll() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PollFormData> }) => {
      const response = await fetch(`${API_BASE}/admin/polls/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['polls'] })
      queryClient.invalidateQueries({ queryKey: ['poll', id] })
    },
  })
}

export function useDeletePoll() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/admin/polls/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    },
  })
}

// Public Hooks

export function usePublicPoll(id: string) {
  return useQuery<PollWithOptions>({
    queryKey: ['publicPoll', id],
    queryFn: () => fetch(`${API_BASE}/polls/${id}`).then(res => {
      if (!res.ok) return null
      return res.json().then(data => data.success ? data.data : null)
    }),
    enabled: !!id,
  })
}

export function useVotePoll() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ pollId, optionId }: { pollId: string; optionId: string }) => {
      const response = await fetch(`${API_BASE}/polls/${pollId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onSuccess: (_, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: ['publicPoll', pollId] })
    },
  })
}