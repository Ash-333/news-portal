import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  horoscopeSchema,
  paginationSchema,
  horoscopeFilterSchema,
} from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/admin/horoscopes
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.AUTHOR,
      Role.ADMIN,
      Role.SUPERADMIN,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) return roleResult;

    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);
    const filters = validateQueryParams(searchParams, horoscopeFilterSchema);

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

    const {
      page = 1,
      limit = 20,
      sortBy,
      order = "desc",
    } = pagination.data as any;
    const { search, zodiacSign, isPublished } = filters.success
      ? filters.data
      : {};

    const where: Record<string, unknown> = {};
    if (isPublished !== undefined) where.isPublished = isPublished;
    if (zodiacSign) where.zodiacSign = zodiacSign;
    if (search) {
      where.OR = [
        { titleNe: { contains: search, mode: "insensitive" } },
        { titleEn: { contains: search, mode: "insensitive" } },
        { contentNe: { contains: search, mode: "insensitive" } },
        { contentEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [horoscopes, total] = await Promise.all([
      prisma.horoscope.findMany({
        where,
        select: {
          id: true,
          zodiacSign: true,
          icon: true,
          titleNe: true,
          titleEn: true,
          contentNe: true,
          contentEn: true,
          date: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, name: true } },
        },
        orderBy: sortBy ? { [sortBy]: order } : { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.horoscope.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: horoscopes,
      message: "Horoscopes retrieved successfully",
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/admin/horoscopes
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.AUTHOR,
      Role.ADMIN,
      Role.SUPERADMIN,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) return roleResult;

    const validation = await validationMiddleware(horoscopeSchema)(req);
    if (validation instanceof NextResponse) return validation;

    const {
      zodiacSign,
      icon,
      titleNe,
      titleEn,
      contentNe,
      contentEn,
      date,
      isPublished,
    } = validation;

    const horoscope = await prisma.horoscope.create({
      data: {
        zodiacSign: zodiacSign as string,
        icon: (icon as string) || "Sparkles",
        titleNe: titleNe as string,
        titleEn: titleEn as string,
        contentNe: contentNe as string,
        contentEn: contentEn as string,
        date: date ? new Date(date as string) : new Date(),
        isPublished: isPublished as boolean,
        authorId: authenticatedReq.user!.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "HOROSCOPE_CREATE",
        targetType: "HOROSCOPE",
        targetId: horoscope.id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: horoscope,
        message: "Horoscope created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
