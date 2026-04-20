import { NextRequest, NextResponse } from "next/server";
import { ArticleStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginationSchema } from "@/lib/validations";
import { validateQueryParams, errorHandler } from "@/lib/middleware";
import { cachedApi, deleteCachedPattern } from "@/lib/redis";

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

async function getAllCategoryIds(categoryId: string): Promise<string[]> {
  const allCategories = await prisma.category.findMany({
    select: { id: true, parentId: true },
  });
  
  const ids: string[] = [];
  const findChildren = (parentId: string) => {
    ids.push(parentId);
    const children = allCategories.filter((c) => c.parentId === parentId);
    for (const child of children) {
      findChildren(child.id);
    }
  };
  
  findChildren(categoryId);
  return ids;
}

// GET /api/articles - List published articles (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);

    if (!pagination.success) {
      return NextResponse.json(
        {
          success: false,
          data: { errors: pagination.errors },
          message: "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    const page = pagination.data.page ?? 1;
    const limit = pagination.data.limit ?? 20;
    const { search, sortBy, order } = pagination.data;
    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("categorySlug");
    const tagId = searchParams.get("tagId");
    const isBreaking = searchParams.get("isBreaking");
    const isFeatured = searchParams.get("isFeatured");
    const province = searchParams.get("province");

    const cacheParams = {
      page,
      limit,
      search,
      sortBy,
      order,
      categoryId,
      categorySlug,
      tagId,
      isBreaking,
      isFeatured,
      province,
    };

    const result = await cachedApi(
      "articles:list",
      cacheParams,
      async () => {
        const where: Record<string, unknown> = {
          status: ArticleStatus.PUBLISHED,
          deletedAt: null,
          publishedAt: { lte: new Date() },
        };

        if (search) {
          where.OR = [
            { titleNe: { contains: search, mode: "insensitive" } },
            { titleEn: { contains: search, mode: "insensitive" } },
            { excerptNe: { contains: search, mode: "insensitive" } },
            { excerptEn: { contains: search, mode: "insensitive" } },
          ];
        }

        if (categorySlug) {
          const category = await prisma.category.findUnique({
            where: { slug: categorySlug },
            select: { id: true },
          });
          
          if (category) {
            const allCategoryIds = await getAllCategoryIds(category.id);
            where.categoryId = { in: allCategoryIds };
          }
        } else if (categoryId) {
          where.categoryId = categoryId;
        }
        if (isBreaking === "true") where.isBreaking = true;
        if (isFeatured === "true") where.isFeatured = true;
        if (province) where.province = province;

        if (tagId) {
          where.tags = {
            some: { tagId },
          };
        }

        const [articles, total] = await Promise.all([
          prisma.article.findMany({
            where,
            select: {
              id: true,
              titleNe: true,
              titleEn: true,
              excerptNe: true,
              excerptEn: true,
              slug: true,
              isBreaking: true,
              isFeatured: true,
              province: true,
              publishedAt: true,
              viewCount: true,
              ogImage: true,
              featuredImage: {
                select: { id: true, url: true },
              },
              author: {
                select: { id: true, name: true, nameNe: true, profilePhoto: true },
              },
              category: {
                select: { id: true, nameNe: true, nameEn: true, slug: true },
              },
              tags: {
                select: {
                  tag: {
                    select: {
                      id: true,
                      nameNe: true,
                      nameEn: true,
                      slug: true,
                    },
                  },
                },
              },
              _count: {
                select: { comments: true },
              },
            },
            orderBy: sortBy ? { [sortBy]: order } : { publishedAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.article.count({ where }),
        ]);

        return {
          articles: formatArticles(articles),
          total,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      },
      CACHE_TTL,
    );

    return NextResponse.json({
      success: true,
      data: result.articles,
      message: "Articles retrieved successfully",
      pagination: result.pagination,
    });
  } catch (error) {
    return errorHandler(error);
  }
}
