import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, errorHandler, AuthenticatedRequest } from "@/lib/middleware";
import jwt from "jsonwebtoken";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-secret-key";

// POST /api/auth/logout - Invalidate refresh token ( blacklist approach)
export async function POST(req: NextRequest) {
  try {
    // Get refresh token from cookie or body
    const body = await req.json().catch(() => ({}));
    const refreshToken = body.refreshToken || req.cookies.get("refreshToken")?.value;

    // If using token blacklist, add to blacklist
    // For simplicity, we just return success as JWT are stateless
    // In production, implement token blacklist/revocation

    return NextResponse.json({
      success: true,
      data: null,
      message: "Logged out successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}