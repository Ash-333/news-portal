import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  createUserSchema,
  userFilterSchema,
  paginationSchema,
} from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";
import { canManageRole, hasPermission, permissions } from "@/lib/permissions";

// GET /api/users - List all users (Admin+)
export async function GET(req: NextRequest) {
  try {
    // Authenticate
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Check role - Admin+
    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    // Parse query params
    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);
    const filters = validateQueryParams(searchParams, userFilterSchema);

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

    const { page = 1, limit = 10, sortBy, order } = pagination.data;
    const { role, status, search } = filters.success ? filters.data : {};

    // Build where clause
    const where: Record<string, unknown> = { deletedAt: null };

    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          profilePhoto: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: {
              articles: true,
              comments: true,
            },
          },
        },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      message: "Users retrieved successfully",
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

// POST /api/users - Create user directly (Admin+)
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    if (!hasPermission(authenticatedReq.user?.role, permissions.usersCreate)) {
      return NextResponse.json(
        { success: false, data: null, message: "Forbidden" },
        { status: 403 },
      );
    }

    const validation = await validationMiddleware(createUserSchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { name, nameNe, bio, profilePhoto, email, password, role } = validation;

    if (!canManageRole(authenticatedReq.user?.role, role)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "You do not have permission to assign this role",
        },
        { status: 403 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
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

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        nameNe: nameNe || null,
        bio: bio || null,
        profilePhoto: profilePhoto || null,
        email,
        passwordHash,
        role,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "USER_CREATE",
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
        message: "User created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
