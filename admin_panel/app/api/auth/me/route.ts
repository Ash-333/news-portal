import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware, errorHandler, AuthenticatedRequest } from "@/lib/middleware";

// GET /api/auth/me - Get current authenticated user
export async function GET(req: NextRequest) {
  try {
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
        createdAt: true,
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
      message: "User retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}