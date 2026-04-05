import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validations";
import {
  authMiddleware,
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// PUT /api/auth/profile - Update current user profile
export async function PUT(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const validation = await validationMiddleware(updateUserSchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const updatedUser = await prisma.user.update({
      where: { id: authenticatedReq.user!.id },
      data: validation,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profilePhoto: true,
        language: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}