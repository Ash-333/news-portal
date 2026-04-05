import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations";
import {
  authMiddleware,
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// POST /api/auth/change-password - Change user password
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const validation = await validationMiddleware(changePasswordSchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { currentPassword, newPassword } = validation;

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
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Password changed successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}