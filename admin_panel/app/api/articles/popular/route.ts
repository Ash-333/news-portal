import { NextRequest, NextResponse } from "next/server";
import { ArticleStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/middleware";
import { cachedApi } from "@/lib/redis";

const CACHE_TTL = 300; // 5 minutes

function formatArticles(articles: any[]) {
  return articles.map((article) => ({
    ...article,
    tags: article.tags.map((t: any) => t.tag),
    featuredImage: article.featuredImage
      ? {
          ...article.featuredImage,
          url: article.featuredImage.url,
        }
      : null,
  }));
}

function getPeriodStartDate(period: string | null): Date | undefined {
  if (!period) return undefined;

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case "today":
      return startOfDay;
    case "week":
      const weekAgo = new Date(startOfDay);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo;
    case "month":
      const monthAgo = new Date(startOfDay);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return monthAgo;
    default:
      return undefined;
  }
}

// GET /api/articles/popular - Get most read articles
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 10, 50) : 10;

    const cacheParams = { period, limit };

    const result = await cachedApi(
      "articles:popular",
      cacheParams,
      async () => {
        const periodStart = getPeriodStartDate(period);

        let where: Record<string, unknown> = {
          status: ArticleStatus.PUBLISHED,
          deletedAt: null,
          publishedAt: { lte: new Date() },
        };

        if (periodStart) {
          where = {
            ...where,
            publishedAt: {
              gte: periodStart,
              lte: new Date(),
            },
          };
        }

        const articles = await prisma.article.findMany({
          where,
          select: {
            id: true,
            title: true,
            subheading: true,
            excerpt: true,
            slug: true,
            isFlashUpdate: true,
            isFeatured: true,
            isTitleOnly: true,
            publishedAt: true,
            viewCount: true,
            ogImage: true,
            featuredImage: {
              select: { id: true, url: true },
            },
            author: {
              select: { id: true, name: true, image: true },
            },
            category: {
              select: { id: true, name: true, slug: true },
            },
            tags: {
              select: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            _count: {
              select: { comments: true },
            },
          },
          orderBy: { viewCount: "desc" },
          take: limit,
        });

        return formatArticles(articles);
      },
      CACHE_TTL,
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: "Popular articles retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}