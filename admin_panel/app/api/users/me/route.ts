import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { updateUserSchema, changePasswordSchema } from "@/lib/validations";
import {
  authMiddleware,
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/users/me - Get current user profile
export async function GET(req: NextRequest) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const user = await prisma.user.findUnique({
      where: { id: authenticatedReq.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profilePhoto: true,
        bio: true,
        language: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, data: null, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: "Profile retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/users/me - Update current user profile
export async function PATCH(req: NextRequest) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const body = await req.json();

    // Handle password change separately
    if (body.currentPassword || body.newPassword) {
      const validation = changePasswordSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            data: { errors: validation.error.errors },
            message: "Validation failed",
          },
          { status: 422 },
        );
      }

      const { currentPassword, newPassword } = validation.data;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: authenticatedReq.user!.id },
        select: { passwordHash: true },
      });

      if (!user?.passwordHash) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: "Password change not available for OAuth accounts",
          },
          { status: 400 },
        );
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: "Current password is incorrect",
          },
          { status: 400 },
        );
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await prisma.user.update({
        where: { id: authenticatedReq.user!.id },
        data: { passwordHash },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: authenticatedReq.user!.id,
          action: "PASSWORD_CHANGE",
          targetType: "USER",
          targetId: authenticatedReq.user!.id,
          ipAddress: req.headers.get('x-forwarded-for') || null,
          userAgent: req.headers.get("user-agent") || null,
        },
      });

      return NextResponse.json({
        success: true,
        data: null,
        message: "Password changed successfully",
      });
    }

    // Regular profile update
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
