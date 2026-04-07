import { ApiResponse, Article } from "@/types";
import { apiFetch } from "./client";

export interface ArticleListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  breaking?: boolean;
  author?: string;
}

export function getArticles(
  params: ArticleListParams = {},
): Promise<ApiResponse<Article[]>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("categorySlug", params.category);
  if (params.tag) query.set("tag", params.tag);
  if (params.featured) query.set("isFeatured", "true");
  if (params.breaking) query.set("isBreaking", "true");
  if (params.author) query.set("author", params.author);

  const qs = query.toString();
  const endpoint = `/api/articles${qs ? `?${qs}` : ""}`;
  return apiFetch<Article[]>(endpoint, { method: "GET" });
}

export function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  return apiFetch<Article>(`/api/articles/${slug}`, { method: "GET" });
}

export async function incrementView(slug: string): Promise<void> {
  try {
    const response = await apiFetch<null>(`/api/articles/${slug}/view`, {
      method: "POST",
    });
  } catch (error) {
    console.error(
      `[INCREMENT VIEW] Error incrementing view for ${slug}:`,
      error,
    );
    // fire and forget
  }
}

export function getBreakingArticles(): Promise<ApiResponse<Article[]>> {
  return getArticles({ breaking: true });
}

export function getFeaturedArticles(): Promise<ApiResponse<Article[]>> {
  return getArticles({ featured: true });
}

export function getPopularArticles(
  period?: "today" | "week" | "month",
): Promise<ApiResponse<Article[]>> {
  const query = new URLSearchParams();
  if (period) query.set("period", period);
  const qs = query.toString();
  const endpoint = `/api/articles/popular${qs ? `?${qs}` : ""}`;
  return apiFetch<Article[]>(endpoint, { method: "GET" });
}

export function getLatestArticles(
  limit?: number,
): Promise<ApiResponse<Article[]>> {
  return getArticles({ limit });
}
