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

// GET /api/admin/audit-logs - List audit logs (SuperAdmin only)
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) return roleResult;

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
    const userId = searchParams.get("userId");
    const action = searchParams.get("action");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    if (action) where.action = { contains: action, mode: "insensitive" };
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom)
        (where.createdAt as Record<string, Date>).gte = new Date(dateFrom);
      if (dateTo)
        (where.createdAt as Record<string, Date>).lte = new Date(dateTo);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      message: "Audit logs retrieved successfully",
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
