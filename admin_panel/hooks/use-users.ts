'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Role, UserStatus, ApiResponse, PaginationInfo } from '@/types'
import type { CreateUserFormData } from '@/lib/validations'

interface UsersParams {
  page?: number
  limit?: number
  role?: Role
  status?: UserStatus
  search?: string
}

interface UsersResponse {
  data: User[]
  pagination: PaginationInfo
}

const fetchUsers = async (params: UsersParams = {}): Promise<UsersResponse> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.role) searchParams.set('role', params.role)
  if (params.status) searchParams.set('status', params.status)
  if (params.search) searchParams.set('search', params.search)

  const response = await fetch(`/api/users?${searchParams}`)
  const result: ApiResponse<User[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return {
    data: result.data,
    pagination: result.pagination!,
  }
}

const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  const result: ApiResponse<User> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const createUser = async (data: CreateUserFormData): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result: ApiResponse<User> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const updateUserRole = async ({ id, role }: { id: string; role: Role }): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  })
  const result: ApiResponse<User> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const updateUserStatus = async ({ id, status }: { id: string; status: UserStatus }): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const result: ApiResponse<User> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  })
  const result: ApiResponse<null> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
}

// Hooks
export function useUsers(params: UsersParams = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
