import { NextRequest, NextResponse } from "next/server";
import { Role, CommentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginationSchema, commentFilterSchema } from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/admin/comments - List comments for moderation (Admin+)
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.ADMIN,
      Role.SUPERADMIN,
      Role.AUTHOR,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) return roleResult;

    // For authors, only show comments on their own articles
    const isAuthor = authenticatedReq.user?.role === Role.AUTHOR;
    const authorId = isAuthor ? authenticatedReq.user?.id : undefined;

    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);
    const filters = validateQueryParams(searchParams, commentFilterSchema);

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
    const { status, articleId, search } = filters.success ? filters.data : {};

    const where: Record<string, unknown> = { deletedAt: null };
    if (status) where.status = status;
    if (articleId) where.articleId = articleId;
    if (search) {
      where.content = { contains: search, mode: "insensitive" };
    }
    // For authors, only show comments on their own articles
    if (isAuthor && authorId) {
      where.article = { authorId };
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, profilePhoto: true },
          },
          article: {
            select: { id: true, titleNe: true, titleEn: true, slug: true },
          },
        },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: comments,
      message: "Comments retrieved successfully",
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
