'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getArticles,
  getArticleBySlug,
  getFlashUpdateArticles,
  getFeaturedArticles,
  getLatestArticles,
  getPopularArticles,
} from '@/lib/api/articles';
import { Article } from '@/types';

export const articleKeys = {
  list: (params?: Record<string, unknown>) => ['articles', params] as const,
  detail: (slug: string) => ['article', slug] as const,
  breaking: ['articles', 'flash-update'] as const,
  featured: ['articles', 'featured'] as const,
  popular: (period?: string) => ['articles', 'popular', period] as const,
  latest: (limit?: number) => ['articles', 'latest', limit] as const,
};

export function useArticles(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  breaking?: boolean;
  author?: string;
}) {
  return useQuery({
    queryKey: articleKeys.list(params ?? {}),
    queryFn: async () => {
      const res = await getArticles(params ?? {});
      return res.data as Article[];
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: async () => {
      const res = await getArticleBySlug(slug);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useBreakingArticles() {
  return useQuery({
    queryKey: articleKeys.breaking,
    queryFn: async () => {
      const res = await getFlashUpdateArticles();
      return res.data as Article[];
    },
    staleTime: 60 * 1000,
  });
}

export function useFeaturedArticles() {
  return useQuery({
    queryKey: articleKeys.featured,
    queryFn: async () => {
      const res = await getFeaturedArticles();
      return res.data as Article[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePopularArticles(period?: 'today' | 'week' | 'month') {
  return useQuery({
    queryKey: articleKeys.popular(period),
    queryFn: async () => {
      const res = await getPopularArticles(period);
      return res.data as Article[];
    },
    staleTime: 15 * 60 * 1000,
  });
}

export function useLatestArticles(limit?: number) {
  return useQuery({
    queryKey: articleKeys.latest(limit),
    queryFn: async () => {
      const res = await getLatestArticles(limit);
      return res.data as Article[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
