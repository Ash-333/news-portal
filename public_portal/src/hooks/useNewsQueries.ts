'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createComment,
  fetchArticleBySlug,
  fetchCategories,
  fetchComments,
  fetchPublishedArticles,
} from '@/lib/api';
import { getVideos } from '@/lib/api/videos';
import { getAds } from '@/lib/api/ads';
export const newsQueryKeys = {
  articles: ['articles'] as const,
  article: (slug: string) => ['articles', slug] as const,
  categories: ['categories'] as const,
  comments: (articleId: string) => ['comments', articleId] as const,
  videos: ['videos'] as const,
  ads: ['ads'] as const,
};

export function usePublishedArticlesQuery() {
  return useQuery({
    queryKey: newsQueryKeys.articles,
    queryFn: () => fetchPublishedArticles(),
  });
}

export function useArticleQuery(slug: string) {
  return useQuery({
    queryKey: newsQueryKeys.article(slug),
    queryFn: () => fetchArticleBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: newsQueryKeys.categories,
    queryFn: () => fetchCategories(),
  });
}

export function useCommentsQuery(articleId: string) {
  return useQuery({
    queryKey: newsQueryKeys.comments(articleId),
    queryFn: () => fetchComments(articleId),
    enabled: Boolean(articleId),
  });
}

export function useCreateCommentMutation(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: newsQueryKeys.comments(articleId) });
    },
  });
}

export function useVideosQuery(params = {}) {
  return useQuery({
    queryKey: [...newsQueryKeys.videos, params],
    queryFn: () => getVideos(params),
  });
}

export function useAdsQuery() {
  return useQuery({
    queryKey: newsQueryKeys.ads,
    queryFn: () => getAds(),
  });
}


