import { NextRequest, NextResponse } from "next/server";
import { Role, ArticleStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  articleSchema,
  articleStatusSchema,
  scheduleArticleSchema,
} from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/admin/articles/:id - Get single article (Author+)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id, deletedAt: null },
      include: {
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
          include: {
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
        featuredImage: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, data: null, message: "Article not found" },
        { status: 404 },
      );
    }

    // Authors can only view their own articles
    if (
      authenticatedReq.user?.role === Role.AUTHOR &&
      article.authorId !== authenticatedReq.user.id
    ) {
      return NextResponse.json(
        { success: false, data: null, message: "Forbidden" },
        { status: 403 },
      );
    }

    // Flatten tags
    const formattedArticle = {
      ...article,
      tags: article.tags.map((t) => t.tag),
    };

    return NextResponse.json({
      success: true,
      data: formattedArticle,
      message: "Article retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/admin/articles/:id - Update article
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Debug: Log the id value
    const { id } = await params;

    // Get existing article
    const existingArticle = await prisma.article.findUnique({
      where: { id, deletedAt: null },
      select: { authorId: true, status: true, titleNe: true, titleEn: true },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, data: null, message: "Article not found" },
        { status: 404 },
      );
    }

    const isAuthor = existingArticle.authorId === authenticatedReq.user?.id;
    const userRole = authenticatedReq.user?.role;
    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPERADMIN;

    // Authors can only edit their own articles
    if (authenticatedReq.user?.role === Role.AUTHOR && !isAuthor) {
      return NextResponse.json(
        { success: false, data: null, message: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await req.json();

    // Handle status change
    if (body.status !== undefined) {
      if (!isAdmin) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: "Only admins can change article status",
          },
          { status: 403 },
        );
      }

      const validation = articleStatusSchema.safeParse(body);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        return NextResponse.json(
          {
            success: false,
            data: { errors: validation.error.errors },
            message: firstError ? firstError.message : "Validation failed",
          },
          { status: 422 },
        );
      }

      const updateData: Record<string, unknown> = {
        status: validation.data.status,
      };

      if (validation.data.status === ArticleStatus.PUBLISHED) {
        updateData.publishedAt = new Date();
      }

      const article = await prisma.article.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          status: true,
          publishedAt: true,
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: authenticatedReq.user!.id,
          action: `ARTICLE_STATUS_${validation.data.status}`,
          targetType: "ARTICLE",
          targetId: id,
          ipAddress: req.headers.get("x-forwarded-for") || null,
          userAgent: req.headers.get("user-agent") || null,
        },
      });

      return NextResponse.json({
        success: true,
        data: article,
        message: "Article status updated successfully",
      });
    }

    // Handle schedule
    if (body.scheduledAt !== undefined) {
      if (!isAdmin) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: "Only admins can schedule articles",
          },
          { status: 403 },
        );
      }

      const validation = scheduleArticleSchema.safeParse(body);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        return NextResponse.json(
          {
            success: false,
            data: { errors: validation.error.errors },
            message: firstError ? firstError.message : "Validation failed",
          },
          { status: 422 },
        );
      }

      const article = await prisma.article.update({
        where: { id },
        data: { scheduledAt: new Date(validation.data.scheduledAt) },
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          scheduledAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: article,
        message: "Article scheduled successfully",
      });
    }

    // Regular article update
    // Use the already-parsed body from line 150 instead of reading again
    const validation = articleSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      return NextResponse.json(
        {
          success: false,
          data: { errors: validation.error.errors },
          message: firstError ? firstError.message : "Validation failed",
        },
        { status: 422 },
      );
    }

    const validatedData = validation.data as {
      tagIds?: string[];
      scheduledAt?: string;
      featuredImageId?: string;
      [key: string]: unknown;
    };
    const { tagIds, scheduledAt, featuredImageId, ...rest } = validatedData;

    const articleData: Record<string, unknown> = {
      ...rest,
    };

    if (scheduledAt && scheduledAt !== "") {
      let dateStr = scheduledAt as string;
      if (dateStr.split(":").length === 2) {
        dateStr = dateStr + ":00";
      }
      if (!dateStr.endsWith("Z") && !dateStr.includes("+")) {
        const nepalOffset = 5.75 * 60 * 60 * 1000;
        const nepalDate = new Date(dateStr);
        const utcDate = new Date(nepalDate.getTime() - nepalOffset);
        articleData.scheduledAt = utcDate;
        articleData.status = 'SCHEDULED';
      } else {
        articleData.scheduledAt = new Date(dateStr);
        articleData.status = 'SCHEDULED';
      }
    }

    if (featuredImageId && featuredImageId !== "") {
      articleData.featuredImageId = featuredImageId;
    }

    // Regenerate slug if title changed
    const titleNeChanged = rest.titleNe && rest.titleNe !== existingArticle.titleNe;
    const titleEnChanged = rest.titleEn && rest.titleEn !== existingArticle.titleEn;
    if (titleNeChanged || titleEnChanged) {
      const newTitle = (rest.titleEn as string) || existingArticle.titleEn;
      articleData.slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(articleData as typeof articleData),
        tags: tagIds && tagIds.length > 0
          ? {
              deleteMany: {},
              create: tagIds.map((tagId: string) => ({ tagId })),
            }
          : undefined,
      } as any,
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        slug: true,
        status: true,
        updatedAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "ARTICLE_UPDATE",
        targetType: "ARTICLE",
        targetId: id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: article,
      message: "Article updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/admin/articles/:id - Soft delete article (Admin+)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Check role - Admin+
    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const { id } = await params;

    // Soft delete
    await prisma.article.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: ArticleStatus.ARCHIVED,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "ARTICLE_DELETE",
        targetType: "ARTICLE",
        targetId: id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Article deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
