import { NextRequest, NextResponse } from "next/server";
import { Role, CommentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateCommentSchema } from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// PATCH /api/comments/:id - Update own comment (within 15 minutes)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, data: null, message: "Comment not found" },
        { status: 404 },
      );
    }

    // Check if user owns the comment
    if (comment.userId !== authenticatedReq.user?.id) {
      return NextResponse.json(
        { success: false, data: null, message: "Forbidden" },
        { status: 403 },
      );
    }

    // Check if within 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (comment.createdAt < fifteenMinutesAgo) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Comment can only be edited within 15 minutes",
        },
        { status: 400 },
      );
    }

    const validation = await validationMiddleware(updateCommentSchema)(req);
    if (validation instanceof NextResponse) return validation;

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content: validation.content,
        editedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/comments/:id - Delete comment (own or Admin+)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const { id } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, data: null, message: "Comment not found" },
        { status: 404 },
      );
    }

    const isOwner = comment.userId === authenticatedReq.user?.id;
    const userRole = authenticatedReq.user?.role;
    const isAdmin = userRole === Role.ADMIN || userRole === Role.SUPERADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, data: null, message: "Forbidden" },
        { status: 403 },
      );
    }

    await prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
