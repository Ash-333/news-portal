'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, login as apiLogin, logout as apiLogout, LoginCredentials, RegisterData, refreshAccessToken } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'userData';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function setStoredRefreshToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    // Load user from localStorage (no API call needed since /api/auth/me doesn't exist)
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    // Try to get user from localStorage
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    } else {
      // No stored user but token exists - clear token
      setStoredToken(null);
      setStoredRefreshToken(null);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    if (response.success && response.data) {
      // Store both access and refresh tokens
      setStoredToken(response.data.accessToken);
      setStoredRefreshToken(response.data.refreshToken);
      
      // Create user object from response (subset of User fields)
      const user: User = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
        profilePhoto: response.data.profilePhoto,
        bio: null,
        language: 'ENGLISH',
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      setUser(user);
      // Store user in localStorage for persistence
      setStoredUser(user);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    const response = await apiLogin({ email: data.email, password: data.password } as LoginCredentials);
    // After register, user needs to verify email, so we don't auto-login
    // This is handled by the register page
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore errors
    } finally {
      setStoredToken(null);
      setStoredRefreshToken(null);
      setStoredUser(null);
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isEmailVerified = user?.emailVerified ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isEmailVerified,
        login,
        register,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
}

// Helper hook for routes that need verified email
export function useRequireVerifiedEmail() {
  const { isAuthenticated, isEmailVerified, isLoading } = useAuth();
  return { isAuthenticated, isEmailVerified, isLoading };
}