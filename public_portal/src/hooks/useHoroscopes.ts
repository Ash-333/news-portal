'use client';

import { useQuery } from '@tanstack/react-query';
import { getHoroscopes, getHoroscopeById, HoroscopeParams } from '@/lib/api/horoscopes';
import { Horoscope } from '@/types';

export const horoscopeKeys = {
  all: ['horoscopes'] as const,
  lists: () => [...horoscopeKeys.all, 'list'] as const,
  list: (params: HoroscopeParams) => [...horoscopeKeys.lists(), params] as const,
  details: () => [...horoscopeKeys.all, 'detail'] as const,
  detail: (id: string) => [...horoscopeKeys.details(), id] as const,
};

export function useHoroscopes(params?: HoroscopeParams) {
  return useQuery({
    queryKey: horoscopeKeys.list(params || {}),
    queryFn: async () => {
      const res = await getHoroscopes(params);
      return res.data as Horoscope[];
    },
  });
}

export function useHoroscope(id: string) {
  return useQuery({
    queryKey: horoscopeKeys.detail(id),
    queryFn: async () => {
      const res = await getHoroscopeById(id);
      return res.data as Horoscope;
    },
    enabled: !!id,
  });
}
