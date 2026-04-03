import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginationSchema } from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/users/:id/activity - Get user audit log (Admin+)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    // Parse query params
    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);

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

    const { page = 1, limit = 10 } = pagination.data;

    // Get audit logs for user
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where: { userId: id } }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      message: "User activity retrieved successfully",
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
