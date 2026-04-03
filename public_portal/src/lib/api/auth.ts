import { ApiResponse, User } from '@/types';
import { apiFetch } from './client';

const REFRESH_TOKEN_KEY = 'refreshToken';

function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  profilePhoto: string | null;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function resendVerificationEmail(email: string): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>('/api/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export function logout(): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiFetch<User>('/api/auth/me', {
    method: 'GET',
  });
}

export function refreshAccessToken(): Promise<ApiResponse<{ accessToken: string; refreshToken: string; expiresIn: number }>> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  return apiFetch<{ accessToken: string; refreshToken: string; expiresIn: number }>('/api/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  return apiFetch<User>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
  return apiFetch<{ message: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}