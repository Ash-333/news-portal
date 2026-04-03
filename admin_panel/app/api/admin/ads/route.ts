import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { advertisementSchema, paginationSchema } from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/admin/ads
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
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

    const { page = 1, limit = 10, sortBy, order } = pagination.data;
    const where: Record<string, unknown> = { deletedAt: null };

    const [ads, total] = await Promise.all([
      prisma.advertisement.findMany({
        where,
        include: { creator: { select: { id: true, name: true } } },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.advertisement.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: ads,
      message: "Advertisements retrieved successfully",
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/admin/ads
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) return roleResult;

    const validation = await validationMiddleware(advertisementSchema)(req);
    if (validation instanceof NextResponse) return validation;

    const { startDate, endDate, ...rest } = validation;

    const adData: Record<string, unknown> = { ...rest };
    if (startDate && startDate !== "")
      adData.startDate = new Date(startDate as string);
    if (endDate && endDate !== "") adData.endDate = new Date(endDate as string);

    const adDataClean = adData as {
      titleNe: string;
      titleEn: string;
      mediaUrl: string;
      mediaType?: string;
      linkUrl?: string | null;
      position?: string;
      isActive?: boolean;
      startDate?: Date | null;
      endDate?: Date | null;
    };

    const ad = await prisma.advertisement.create({
      data: {
        ...adDataClean,
        creator: { connect: { id: authenticatedReq.user!.id } },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "AD_CREATE",
        targetType: "ADVERTISEMENT",
        targetId: ad.id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: ad,
        message: "Advertisement created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
