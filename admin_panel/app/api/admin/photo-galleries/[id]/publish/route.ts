import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  authMiddleware,
  roleMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";
import { deleteCachedPattern } from "@/lib/redis";

// PATCH /api/admin/photo-galleries/[id]/publish - Publish photo gallery
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const gallery = await prisma.photoGallery.update({
      where: { id },
      data: {
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await deleteCachedPattern("photo-galleries:");

    return NextResponse.json({
      success: true,
      data: gallery,
      message: "Photo gallery published successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
