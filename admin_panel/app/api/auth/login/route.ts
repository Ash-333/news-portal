import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { UserStatus } from "@prisma/client";
import { checkRateLimitForRequest } from "@/lib/middleware";
import { errorHandler } from "@/lib/middleware";
import { generateTokens } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimitForRequest(req, "api");
    if (!rateLimit.allowed) {
      return rateLimit.response!;
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validation.email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        status: true,
        profilePhoto: true,
      },
    });

    // User not found or no password (OAuth users without password)
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check user status - only ACTIVE users can login
    if (user.status !== UserStatus.ACTIVE) {
      return NextResponse.json(
        { success: false, message: "Account is suspended or banned" },
        { status: 403 },
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validation.password,
      user.passwordHash,
    );

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN_API",
        targetType: "USER",
        targetId: user.id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    // Generate JWT tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data with tokens
    const response = NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePhoto: user.profilePhoto,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
        },
        message: "Login successful",
      },
      { status: 200 },
    );

    // Add CORS headers for external apps
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    return errorHandler(error);
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
}
