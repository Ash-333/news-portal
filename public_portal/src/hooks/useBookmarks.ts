import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { Article } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface Bookmark {
  id: string;
  articleId: string;
  bookmarked: boolean;
  article?: Article;
}

export function useBookmarkQuery() {
  return useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      return apiFetch<Bookmark[]>('/api/bookmarks', { method: 'GET' });
    },
  });
}

export function useAddBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      return apiFetch<{ success: boolean; data: Bookmark }>(
        '/api/bookmarks',
        {
          method: 'POST',
          body: JSON.stringify({ articleId }),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useRemoveBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      return apiFetch<{ success: boolean }>(
        `/api/bookmarks/${articleId}`,
        { method: 'DELETE' }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}