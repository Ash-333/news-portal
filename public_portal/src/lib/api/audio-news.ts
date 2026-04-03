import { ApiResponse, AudioNews } from "@/types";
import { apiFetch } from "./client";

export interface AudioNewsListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

export function getAudioNewsList(
  params?: AudioNewsListParams,
): Promise<ApiResponse<AudioNews[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.categoryId) query.set("categoryId", params.categoryId);
  if (params?.search) query.set("search", params.search);

  const qs = query.toString();
  const endpoint = `/api/audio-news${qs ? `?${qs}` : ""}`;
  return apiFetch<AudioNews[]>(endpoint, { method: "GET" });
}

export function getAudioNews(id: string): Promise<ApiResponse<AudioNews>> {
  return apiFetch<AudioNews>(`/api/audio-news/${id}`, { method: "GET" });
}
