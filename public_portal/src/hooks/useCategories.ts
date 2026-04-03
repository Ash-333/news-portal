'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryBySlug } from '@/lib/api/categories';
import { Category } from '@/types';

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (slug: string) => ['category', slug] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const res = await getCategories();
      return res.data as Category[];
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => {
      const res = await getCategoryBySlug(slug);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });
}
