import type {
  Article,
  ArticleCategory,
  Author,
  Category,
  Comment,
  Tag,
  FeaturedImage,
} from "@/types";

export const ARTICLE_FALLBACK_IMAGE = "/images/placeholder-news.svg";

type JsonRecord = Record<string, any>;
type FetchOptions = RequestInit & { next?: { revalidate?: number } };

function isServer() {
  return typeof window === "undefined";
}

function getBaseUrl() {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
}

function buildUrl(path: string) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    if (isServer()) {
      throw new ApiError(
        500,
        "Missing API base URL. Set API_URL or NEXT_PUBLIC_API_URL to your backend origin.",
      );
    }

    return path;
  }

  return new URL(path, baseUrl).toString();
}

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  return [];
}

function unwrapList<T>(payload: unknown, keys: string[] = []): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as JsonRecord;

  for (const key of keys) {
    if (Array.isArray(record[key])) {
      return record[key] as T[];
    }
  }

  for (const key of ["data", "items", "results"]) {
    if (Array.isArray(record[key])) {
      return record[key] as T[];
    }
  }

  if (record.data && typeof record.data === "object") {
    for (const key of keys) {
      if (Array.isArray(record.data[key])) {
        return record.data[key] as T[];
      }
    }
  }

  return [];
}

function unwrapItem<T>(payload: unknown, keys: string[] = []): T | null {
  if (!payload) {
    return null;
  }

  if (typeof payload !== "object" || Array.isArray(payload)) {
    return payload as T;
  }

  const record = payload as JsonRecord;

  for (const key of keys) {
    if (record[key]) {
      return record[key] as T;
    }
  }

  if (record.data && typeof record.data === "object") {
    const data = record.data as JsonRecord;
    for (const key of keys) {
      if (data[key]) {
        return data[key] as T;
      }
    }

    return record.data as T;
  }

  return record as T;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function coerceString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function coerceNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function estimateReadTime(content: string) {
  const words = content
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isApiErrorWithStatus(error: unknown, status: number) {
  return error instanceof ApiError && error.status === status;
}

export async function apiFetch<T>(
  path: string,
  init?: FetchOptions,
): Promise<T> {
  const url = buildUrl(path);
  const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  };

  if (init?.cache) {
    fetchOptions.cache = init.cache;
  } else if (!init?.next?.revalidate) {
    fetchOptions.cache = "no-store";
  }

  const response = await fetch(url, {
    ...fetchOptions,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorPayload = await response.json();
      message = errorPayload?.message || errorPayload?.error || message;
    } catch {}

    if (response.status === 404 && !getBaseUrl()) {
      message = `Request failed with status 404. Set NEXT_PUBLIC_API_URL or API_URL to your backend base URL.`;
    }

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export function normalizeCategory(raw: any): Category {
  const name = coerceString(
    raw?.name ?? raw?.nameEn ?? raw?.name_en,
    "General",
  );
  const slug = coerceString(raw?.slug, slugify(name || "general"));

  return {
    id: String(raw?.id ?? raw?._id ?? slug),
    slug,
    name,
    nameNe: coerceString(raw?.nameNe ?? raw?.name_ne, name),
    nameEn: coerceString(raw?.nameEn ?? raw?.name_en),
  };
}

export function normalizeTag(raw: any): Tag {
  const name = coerceString(raw?.name ?? raw?.nameEn ?? raw?.name_en, "Tag");
  const slug = coerceString(raw?.slug, slugify(name || "tag"));

  return {
    id: String(raw?.id ?? raw?._id ?? slug),
    slug,
    name,
    nameNe: coerceString(raw?.nameNe ?? raw?.name_ne, name),
    nameEn: coerceString(raw?.nameEn ?? raw?.name_en),
  };
}

export function normalizeAuthor(raw: any): Author {
  const name = coerceString(
    raw?.name ?? raw?.fullName ?? raw?.username ?? raw?.email,
    "Staff",
  );
  const slug = coerceString(raw?.slug, slugify(name || "staff"));

  return {
    id: String(raw?.id ?? raw?._id ?? slug),
    slug,
    name,
    nameNe: coerceString(raw?.nameNe ?? raw?.name_ne, name),
    email: coerceString(raw?.email),
    bio: coerceString(raw?.bio),
    bioNe: coerceString(raw?.bioNe ?? raw?.bio_ne),
    avatar: coerceString(
      raw?.avatar ?? raw?.avatarUrl ?? raw?.profileImage ?? raw?.profilePhoto,
    ),
    socialLinks: raw?.socialLinks,
    articleCount: coerceNumber(
      raw?.articleCount ?? raw?.articlesCount ?? raw?._count?.articles,
      0,
    ),
  };
}

export function normalizeArticle(raw: any): Article {
  const content = coerceString(raw?.content ?? raw?.body ?? raw?.description);
  const contentNe = coerceString(raw?.contentNe ?? raw?.content_ne);
  const contentEn = coerceString(raw?.contentEn ?? raw?.content_en);
  const title = coerceString(
    raw?.title ?? raw?.titleEn ?? raw?.title_en,
    "Untitled",
  );
  const excerpt = coerceString(
    raw?.excerpt ??
      raw?.excerptEn ??
      raw?.excerpt_en ??
      raw?.summary ??
      raw?.subTitle,
    content.slice(0, 180),
  );
  const category = normalizeCategory(
    raw?.category ?? raw?.categoryId ?? raw?.section ?? {},
  );
  const author = normalizeAuthor(
    raw?.author ?? raw?.createdBy ?? raw?.user ?? {},
  );
  const tags = toArray<any>(raw?.tags).map(normalizeTag);

  // Handle featuredImage - can be string or object with id/url
  let featuredImage: FeaturedImage | null = null;
  if (raw?.featuredImage) {
    if (typeof raw.featuredImage === "string") {
      featuredImage = {
        id: raw.featuredImage,
        url: raw.featuredImage,
      };
    } else if (raw.featuredImage?.url) {
      featuredImage = {
        id: raw.featuredImage.id || "",
        url: raw.featuredImage.url,
      };
    }
  }

  const publishedAt = coerceString(
    raw?.publishedAt ?? raw?.published_at ?? raw?.createdAt,
    new Date().toISOString(),
  );

  return {
    id: String(raw?.id ?? raw?._id ?? raw?.slug ?? title),
    slug: coerceString(raw?.slug, slugify(title || "article")),
    title,
    titleNe: coerceString(raw?.titleNe ?? raw?.title_ne),
    titleEn: coerceString(raw?.titleEn ?? raw?.title_en),
    excerpt,
    excerptNe: coerceString(raw?.excerptNe ?? raw?.excerpt_ne),
    excerptEn: coerceString(raw?.excerptEn ?? raw?.excerpt_en),
    content,
    contentNe,
    contentEn,
    featuredImage,
    category,
    author,
    tags,
    publishedAt,
    modifiedAt: coerceString(
      raw?.modifiedAt ?? raw?.updatedAt ?? raw?.updated_at,
    ),
    readTime: coerceNumber(
      raw?.readTime ?? raw?.read_time,
      estimateReadTime(content),
    ),
    views: coerceNumber(raw?.views ?? raw?.viewCount ?? raw?.view_count, 0),
    isFlashUpdate: Boolean(raw?.isFlashUpdate ?? raw?.breaking),
    isFeatured: Boolean(raw?.isFeatured ?? raw?.featured),
    isOpinion: Boolean(raw?.isOpinion ?? raw?.opinion),
  };
}

export function normalizeComment(raw: any): Comment {
  const authorName = coerceString(
    raw?.author?.name ?? raw?.user?.name ?? raw?.authorName ?? raw?.name,
    "Anonymous",
  );

  return {
    id: String(
      raw?.id ?? raw?._id ?? `${authorName}-${raw?.createdAt ?? Date.now()}`,
    ),
    articleId: String(raw?.articleId ?? raw?.article ?? raw?.postId ?? ""),
    author: {
      name: authorName,
      avatar: coerceString(raw?.author?.avatar ?? raw?.user?.avatar),
    },
    content: coerceString(raw?.content ?? raw?.text),
    createdAt: coerceString(
      raw?.createdAt ?? raw?.created_at,
      new Date().toISOString(),
    ),
    replies: toArray<any>(raw?.replies).map(normalizeComment),
  };
}

export function deriveCategoriesFromArticles(articles: Article[]) {
  const categoryMap = new Map<string, ArticleCategory>();

  for (const article of articles) {
    categoryMap.set(article.category.slug, article.category);
  }

  return Array.from(categoryMap.values());
}

function mergeCategories(...groups: Category[][]) {
  const categoryMap = new Map<string, Category>();

  for (const group of groups) {
    for (const category of group) {
      categoryMap.set(category.slug, category);
    }
  }

  return Array.from(categoryMap.values());
}

export function deriveTagsFromArticles(articles: Article[]) {
  const tagMap = new Map<string, Tag>();

  for (const article of articles) {
    for (const tag of article.tags) {
      tagMap.set(tag.slug, tag);
    }
  }

  return Array.from(tagMap.values());
}

export function deriveAuthorsFromArticles(articles: Article[]) {
  const authorMap = new Map<string, Author>();
  const articleCountMap = new Map<string, number>();

  for (const article of articles) {
    const slug = article.author.slug;
    if (!slug) continue;
    authorMap.set(slug, article.author as unknown as Author);
    articleCountMap.set(slug, (articleCountMap.get(slug) ?? 0) + 1);
  }

  return Array.from(authorMap.values()).map((author) => ({
    ...author,
    articleCount:
      (author as unknown as Author).articleCount ??
      articleCountMap.get(author.slug ?? "") ??
      0,
  }));
}

export async function fetchPublishedArticles(options?: {
  revalidate?: number;
  isFlashUpdate?: boolean;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams();
    if (options?.isFlashUpdate) {
      params.set("isFlashUpdate", "true");
    }
    if (options?.limit) {
      params.set("limit", String(options.limit));
    }
    const queryString = params.toString();
    const payload = await apiFetch<unknown>(`/api/articles${queryString ? `?${queryString}` : ""}`, {
      next: options?.revalidate
        ? { revalidate: options.revalidate }
        : undefined,
    });

    return unwrapList<any>(payload, ["articles"]).map(normalizeArticle);
  } catch (error) {
    if (isApiErrorWithStatus(error, 404)) {
      return [];
    }

    throw error;
  }
}

export async function fetchArticleBySlug(
  slug: string,
  options?: { revalidate?: number },
) {
  try {
    const payload = await apiFetch<unknown>(`/api/articles/${slug}`, {
      next: options?.revalidate
        ? { revalidate: options.revalidate }
        : undefined,
    });

    const article = unwrapItem<any>(payload, ["article"]);
    return article ? normalizeArticle(article) : null;
  } catch (error) {
    if (isApiErrorWithStatus(error, 404)) {
      return null;
    }

    throw error;
  }
}

export async function fetchCategories(options?: { revalidate?: number }) {
  const fallbackArticles = await fetchPublishedArticles(options);
  const derivedCategories = deriveCategoriesFromArticles(fallbackArticles);

  try {
    const payload = await apiFetch<unknown>("/api/categories", {
      next: options?.revalidate
        ? { revalidate: options.revalidate }
        : undefined,
    });

    const categories = unwrapList<any>(payload, ["categories"]).map(
      normalizeCategory,
    );
    if (categories.length > 0) {
      return mergeCategories(
        categories,
        derivedCategories as unknown as Category[],
      );
    }
  } catch {}

  return derivedCategories;
}

export async function fetchComments(articleId: string) {
  try {
    const payload = await apiFetch<unknown>(
      `/api/comments?articleId=${encodeURIComponent(articleId)}`,
    );
    return unwrapList<any>(payload, ["comments"]).map(normalizeComment);
  } catch (error) {
    if (isApiErrorWithStatus(error, 404)) {
      return [];
    }

    throw error;
  }
}

export async function createComment(input: {
  articleId: string;
  content: string;
  authorName?: string;
}) {
  const payload = await apiFetch<unknown>("/api/comments", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const comment = unwrapItem<any>(payload, ["comment"]);
  return comment ? normalizeComment(comment) : null;
}
