import { NextRequest, NextResponse } from "next/server";
import { ArticleStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/middleware";
import { cachedApi } from "@/lib/redis";

const CACHE_TTL = 600; // 10 minutes

function formatArticle(article: any) {
  return {
    ...article,
    contentNe: article.contentNe,
    contentEn: article.contentEn,
    tags: article.tags.map((t: any) => t.tag),
    featuredImage: article.featuredImage
      ? { ...article.featuredImage, url: article.featuredImage.url }
      : null,
  };
}

// GET /api/articles/:slug - Get single published article (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const result = await cachedApi(
      `articles:detail:${slug}`,
      {},
      async () => {
        const isUuid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            slug,
          );

        const article = await prisma.article.findFirst({
          where: isUuid
            ? { id: slug, status: ArticleStatus.PUBLISHED, deletedAt: null }
            : { slug, status: ArticleStatus.PUBLISHED, deletedAt: null },
          select: {
            id: true,
            titleNe: true,
            titleEn: true,
            contentNe: true,
            contentEn: true,
            excerptNe: true,
            excerptEn: true,
            slug: true,
            isBreaking: true,
            isFeatured: true,
            province: true,
            publishedAt: true,
            viewCount: true,
            metaTitle: true,
            metaDescription: true,
            ogImage: true,
            featuredImage: { select: { id: true, url: true } },
            author: {
              select: { id: true, name: true, profilePhoto: true, bio: true },
            },
            category: {
              select: { id: true, nameNe: true, nameEn: true, slug: true },
            },
            tags: {
              select: {
                tag: {
                  select: { id: true, nameNe: true, nameEn: true, slug: true },
                },
              },
            },
            _count: { select: { comments: true } },
          },
        });

        if (!article) return null;

        return formatArticle(article);
      },
      CACHE_TTL,
    );

    if (!result) {
      return NextResponse.json(
        { success: false, data: null, message: "Article not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Article retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
