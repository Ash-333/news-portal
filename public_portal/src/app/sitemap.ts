import { MetadataRoute } from "next";
import { fetchPublishedArticles, fetchCategories } from "@/lib/api";

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${SITE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  },
  {
    url: `${SITE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/videos`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/audio`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articleEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];

  try {
    const [articles, categoriesResult] = await Promise.all([
      fetchPublishedArticles({ revalidate: 300 }),
      fetchCategories({ revalidate: 300 }),
    ]);

    articleEntries = articles.map((article) => ({
      url: `${SITE_URL}/article/${article.slug}`,
      lastModified: new Date(article.modifiedAt || article.publishedAt),
      changeFrequency: "daily" as const,
      priority: article.isFeatured ? 0.9 : 0.8,
    }));

    categoryEntries = categoriesResult.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));
  } catch {
    // If the API is unavailable, return at least static routes
  }

  return [...STATIC_ROUTES, ...categoryEntries, ...articleEntries];
}
