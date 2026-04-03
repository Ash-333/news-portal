import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import {
  validationMiddleware,
  errorHandler,
  checkRateLimitForRequest,
} from "@/lib/middleware";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimitForRequest(req, "api");
    if (!rateLimit.allowed) {
      return rateLimit.response!;
    }

    // Validate request body
    const validation = await validationMiddleware(registerSchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { name, email, password } = validation;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "User with this email already exists",
        },
        { status: 409 },
      );
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user (pending email verification)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "PUBLIC_USER",
        status: UserStatus.ACTIVE, // Auto-active users
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTER",
        targetType: "USER",
        targetId: user.id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "Registration successful. You can now sign in.",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
