import { NextRequest, NextResponse } from "next/server";
import { Role, ArticleStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  articleSchema,
  paginationSchema,
  articleFilterSchema,
} from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/admin/articles - List all articles (Admin+)
export async function GET(req: NextRequest) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Check role - Admin+
    const roleResult = await roleMiddleware([
      Role.ADMIN,
      Role.SUPERADMIN,
      Role.AUTHOR,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);
    const filters = validateQueryParams(searchParams, articleFilterSchema);

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

    const { page = 1, limit = 10, sortBy, order } = pagination.data;
    const { status, search, categoryId, authorId, isBreaking, isFeatured } =
      filters.success ? filters.data : {};

    // Build where clause
    const where: Record<string, unknown> = { deletedAt: null };

    // Authors can only see their own articles
    if (authenticatedReq.user?.role === Role.AUTHOR) {
      where.authorId = authenticatedReq.user.id;
    } else if (authorId) {
      where.authorId = authorId;
    }

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (isBreaking !== undefined) where.isBreaking = isBreaking;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    if (search) {
      where.OR = [
        { titleNe: { contains: search, mode: "insensitive" } },
        { titleEn: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get articles with pagination
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          slug: true,
          status: true,
          isBreaking: true,
          isFeatured: true,
          scheduledAt: true,
          publishedAt: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
          featuredImage: {
            select: {
              id: true,
              url: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
            },
          },
          category: {
            select: {
              id: true,
              nameNe: true,
              nameEn: true,
              slug: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  nameNe: true,
                  nameEn: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    const origin = process.env.APP_URL || req.nextUrl.origin;

    // Flatten tags and convert featured image URL to absolute URL
    const formattedArticles = articles.map((article) => ({
      ...article,
      tags: article.tags.map((t) => t.tag),
      featuredImage: article.featuredImage
        ? {
            ...article.featuredImage,
            url: `${origin}${article.featuredImage.url}`,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      message: "Articles retrieved successfully",
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/admin/articles - Create article (Author+)
export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Check role - Author+
    const roleResult = await roleMiddleware([
      Role.AUTHOR,
      Role.ADMIN,
      Role.SUPERADMIN,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    // Validate request body
    const validation = await validationMiddleware(articleSchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { tagIds, scheduledAt, featuredImageId, ...rest } = validation;

    const articleData: Record<string, unknown> = {
      ...rest,
    };

    if (scheduledAt && scheduledAt !== "") {
      // Ensure datetime has seconds and timezone for proper storage
      let dateStr = scheduledAt as string;
      if (dateStr.split(":").length === 2) {
        // Add seconds if missing (from datetime-local input)
        dateStr = dateStr + ":00";
      }
      // Add timezone if missing (default to UTC)
      if (!dateStr.endsWith("Z") && !dateStr.includes("+")) {
        dateStr = dateStr + "Z";
      }
      articleData.scheduledAt = new Date(dateStr);
    }

    if (featuredImageId && featuredImageId !== "") {
      articleData.featuredImageId = featuredImageId;
    }

    // Generate slug from English title
    const baseSlug = (articleData.titleEn as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check for duplicate slug and append number if needed
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        titleNe: articleData.titleNe as string,
        titleEn: articleData.titleEn as string,
        contentNe: articleData.contentNe as string,
        contentEn: articleData.contentEn as string,
        excerptNe: articleData.excerptNe as string | undefined,
        excerptEn: articleData.excerptEn as string | undefined,
        categoryId: articleData.categoryId as string,
        metaTitle: articleData.metaTitle as string | undefined,
        metaDescription: articleData.metaDescription as string | undefined,
        ogImage: articleData.ogImage as string | undefined,
        isBreaking: articleData.isBreaking as boolean | undefined,
        isFeatured: articleData.isFeatured as boolean | undefined,
        slug,
        authorId: authenticatedReq.user!.id,
        status: ArticleStatus.DRAFT, // Authors can only create drafts
        tags: {
          create: tagIds?.map((tagId) => ({ tagId })) || [],
        },
      },
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        slug: true,
        status: true,
        createdAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "ARTICLE_CREATE",
        targetType: "ARTICLE",
        targetId: article.id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: article,
        message: "Article created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        {
          success: false,
          data: { message: error.message },
          message: "Invalid data provided",
        },
        { status: 400 },
      );
    }

    return errorHandler(error);
  }
}
