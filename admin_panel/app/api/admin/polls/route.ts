import { NextRequest, NextResponse } from "next/server";
import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";
import { z } from "zod";

const pollSchema = z.object({
  questionNe: z.string().min(1, "Nepali question is required"),
  questionEn: z.string().min(1, "English question is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  isMultiple: z.boolean().default(false),
  // Accept both datetime-local format (no timezone) and full ISO format
  startsAt: z
    .string()
    .datetime({ local: true })
    .optional()
    .or(z.string().datetime()),
  expiresAt: z
    .string()
    .datetime({ local: true })
    .optional()
    .or(z.string().datetime()),
  options: z
    .array(
      z.object({
        textNe: z.string().min(1, "Nepali option text is required"),
        textEn: z.string().min(1, "English option text is required"),
      }),
    )
    .min(2, "At least 2 options are required"),
});

const pollFilterSchema = z.object({
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

// GET /api/admin/polls - List all polls (Admin+)
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const filters = validateQueryParams(searchParams, pollFilterSchema);

    const where: Record<string, unknown> = { deletedAt: null };

    if (filters.success) {
      if (filters.data.isActive !== undefined) {
        where.isActive = filters.data.isActive;
      }
      if (filters.data.search) {
        where.OR = [
          {
            questionNe: { contains: filters.data.search, mode: "insensitive" },
          },
          {
            questionEn: { contains: filters.data.search, mode: "insensitive" },
          },
        ];
      }
    }

    const page = 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const [polls, total] = await Promise.all([
      prisma.poll.findMany({
        where,
        include: {
          options: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.poll.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: polls,
      message: "Polls retrieved successfully",
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

// POST /api/admin/polls - Create a new poll (Admin+)
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

    const validation = await validationMiddleware(pollSchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { options, startsAt, expiresAt, ...pollData } = validation;

    const poll = await prisma.poll.create({
      data: {
        ...pollData,
        startsAt: startsAt ? new Date(startsAt as string) : null,
        expiresAt: expiresAt ? new Date(expiresAt as string) : null,
        options: {
          create: options.map((opt, index) => ({
            textNe: opt.textNe,
            textEn: opt.textEn,
            order: index,
          })),
        },
      },
      select: {
        id: true,
        questionNe: true,
        questionEn: true,
        isActive: true,
        createdAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "POLL_CREATE",
        targetType: "POLL",
        targetId: poll.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: poll,
        message: "Poll created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        {
          success: false,
          data: { message: error.message },
          message: "Invalid data provided",
        },
        { status: 400 },
      );
    }

    return errorHandler(error);
  }
}
