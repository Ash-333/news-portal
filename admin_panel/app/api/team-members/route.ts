import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginationSchema } from "@/lib/validations";
import {
  validationMiddleware,
  validateQueryParams,
  errorHandler,
} from "@/lib/middleware";

// GET /api/team-members - List all active team members (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);

    if (!pagination.success) {
      return NextResponse.json(
        {
          success: false,
          data: { errors: pagination.errors },
          message: "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { page = 1, limit = 10, order } = pagination.data;

    const [members, total] = await Promise.all([
      prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.teamMember.count({
        where: { isActive: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: members,
      message: "Team members retrieved successfully",
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