"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, PaginationInfo } from "@/types";

export interface Horoscope {
  id: string;
  zodiacSign: string;
  icon?: string;
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  date: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string };
}

interface HoroscopesParams {
  page?: number;
  limit?: number;
  search?: string;
  zodiacSign?: string;
  isPublished?: boolean;
}

interface HoroscopesResponse {
  data: Horoscope[];
  pagination: PaginationInfo;
}

const fetchHoroscopes = async (
  params: HoroscopesParams = {},
): Promise<HoroscopesResponse> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.zodiacSign) searchParams.set("zodiacSign", params.zodiacSign);
  if (params.isPublished !== undefined)
    searchParams.set("isPublished", params.isPublished.toString());

  const response = await fetch(`/api/admin/horoscopes?${searchParams}`);
  const result: ApiResponse<Horoscope[]> = await response.json();
  if (!result.success) throw new Error(result.message);
  return { data: result.data, pagination: result.pagination! };
};

const createHoroscope = async (data: {
  zodiacSign: string;
  icon?: string;
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  date?: string;
  isPublished?: boolean;
}): Promise<Horoscope> => {
  const response = await fetch("/api/admin/horoscopes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result: ApiResponse<Horoscope> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

const updateHoroscope = async ({
  id,
  ...data
}: Partial<Horoscope> & { id: string }): Promise<Horoscope> => {
  const response = await fetch(`/api/admin/horoscopes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result: ApiResponse<Horoscope> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

const deleteHoroscope = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/horoscopes/${id}`, {
    method: "DELETE",
  });
  const result: ApiResponse<null> = await response.json();
  if (!result.success) throw new Error(result.message);
};

const togglePublishHoroscope = async ({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}): Promise<Horoscope> => {
  const response = await fetch(`/api/admin/horoscopes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPublished }),
  });
  const result: ApiResponse<Horoscope> = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export function useHoroscopes(params: HoroscopesParams = {}) {
  return useQuery({
    queryKey: ["horoscopes", params],
    queryFn: () => fetchHoroscopes(params),
  });
}

export function useCreateHoroscope() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHoroscope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horoscopes"] });
    },
  });
}

export function useUpdateHoroscope() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHoroscope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horoscopes"] });
    },
  });
}

export function useDeleteHoroscope() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHoroscope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horoscopes"] });
    },
  });
}

export function useTogglePublishHoroscope() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: togglePublishHoroscope,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horoscopes"] });
    },
  });
}

// Zodiac signs list with Lucide zodiac icons
export const ZODIAC_SIGNS = [
  { value: "aries", label: "Aries (मेष)", icon: "Flame" },
  { value: "taurus", label: "Taurus (वृषभ)", icon: "Mountain" },
  { value: "gemini", label: "Gemini (मिथुन)", icon: "Cloud" },
  { value: "cancer", label: "Cancer (कर्क)", icon: "Moon" },
  { value: "leo", label: "Leo (सिंह)", icon: "Sun" },
  { value: "virgo", label: "Virgo (कन्या)", icon: "Wheat" },
  { value: "libra", label: "Libra (तुला)", icon: "Scale" },
  { value: "scorpio", label: "Scorpio (वृश्चिक)", icon: "Bug" },
  { value: "sagittarius", label: "Sagittarius (धनुष)", icon: "Target" },
  { value: "capricorn", label: "Capricorn (मकर)", icon: "MountainSnow" },
  { value: "aquarius", label: "Aquarius (कुम्भ)", icon: "Droplets" },
  { value: "pisces", label: "Pisces (मीन)", icon: "Fish" },
];

// Helper function to get icon by zodiac sign
export function getZodiacIcon(zodiacSign: string): string {
  const sign = ZODIAC_SIGNS.find((s) => s.value === zodiacSign);
  return sign?.icon || "Sparkles";
}
