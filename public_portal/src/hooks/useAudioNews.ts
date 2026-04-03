'use client';

import { useQuery } from '@tanstack/react-query';
import { getAudioNewsList, getAudioNews, AudioNewsListParams } from '@/lib/api/audio-news';
import { AudioNews } from '@/types';

export const audioNewsKeys = {
  all: ['audioNews'] as const,
  lists: () => [...audioNewsKeys.all, 'list'] as const,
  list: (params: AudioNewsListParams) => [...audioNewsKeys.lists(), params] as const,
  details: () => [...audioNewsKeys.all, 'detail'] as const,
  detail: (id: string) => [...audioNewsKeys.details(), id] as const,
};

export function useAudioNewsList(params?: AudioNewsListParams) {
  return useQuery({
    queryKey: audioNewsKeys.list(params || {}),
    queryFn: async () => {
      const res = await getAudioNewsList(params);
      return res.data as AudioNews[];
    },
  });
}

export function useAudioNews(id: string) {
  return useQuery({
    queryKey: audioNewsKeys.detail(id),
    queryFn: async () => {
      const res = await getAudioNews(id);
      return res.data as AudioNews;
    },
    enabled: !!id,
  });
}
