import { ApiResponse, Horoscope } from "@/types";
import { apiFetch } from "./client";

export interface HoroscopeParams {
  date?: string;
  zodiacSign?: string;
  limit?: number;
  page?: number;
}

export function getHoroscopes(
  params?: HoroscopeParams,
): Promise<ApiResponse<Horoscope[]>> {
  const query = new URLSearchParams();
  if (params?.date) query.set("date", params.date);
  if (params?.zodiacSign) query.set("zodiacSign", params.zodiacSign);
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));

  const qs = query.toString();
  const endpoint = `/api/horoscopes${qs ? `?${qs}` : ""}`;
  return apiFetch<Horoscope[]>(endpoint, { method: "GET" });
}

export function getHoroscopeById(id: string): Promise<ApiResponse<Horoscope>> {
  return apiFetch<Horoscope>(`/api/horoscopes/${id}`, { method: "GET" });
}
