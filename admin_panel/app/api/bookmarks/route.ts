import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookmarkSchema, paginationSchema } from "@/lib/validations";
import {
  authMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/bookmarks - List user's bookmarks
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

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

    const { page = 1, limit = 10 } = pagination.data;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: authenticatedReq.user!.id },
        include: {
          article: {
            select: {
              id: true,
              titleNe: true,
              titleEn: true,
              slug: true,
              excerptNe: true,
              excerptEn: true,
              ogImage: true,
              publishedAt: true,
              category: {
                select: { id: true, nameNe: true, nameEn: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookmark.count({
        where: { userId: authenticatedReq.user!.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookmarks,
      message: "Bookmarks retrieved successfully",
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

// POST /api/bookmarks - Toggle bookmark
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const validation = await validationMiddleware(bookmarkSchema)(req);
    if (validation instanceof NextResponse) return validation;

    const { articleId } = validation;

    // Check if bookmark exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: authenticatedReq.user!.id,
          articleId,
        },
      },
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });

      return NextResponse.json({
        success: true,
        data: { bookmarked: false },
        message: "Bookmark removed successfully",
      });
    } else {
      // Add bookmark
      const bookmark = await prisma.bookmark.create({
        data: {
          userId: authenticatedReq.user!.id,
          articleId,
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: { bookmarked: true, bookmark },
          message: "Bookmark added successfully",
        },
        { status: 201 },
      );
    }
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/bookmarks/:articleId - Remove bookmark
export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { success: false, data: null, message: "Article ID is required" },
        { status: 400 },
      );
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: authenticatedReq.user!.id,
        articleId,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
