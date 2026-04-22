import { NextRequest, NextResponse } from "next/server";
import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginationSchema } from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

const booleanFromInput = (value: unknown): boolean => {
  if (value === "true") return true;
  if (value === "false") return false;
  return false;
};

// GET /api/admin/team-members - List all team members
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN, Role.AUTHOR])(
      authenticatedReq
    );
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

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
        orderBy: { order: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.teamMember.count(),
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

// POST /api/admin/team-members - Create team member
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
      authenticatedReq
    );
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const body = await req.json();

    const { name, nameNe, department, departmentNe, designation, designationNe, image, bio, bioNe, email, phone, newsEmail, facebook, order, isActive } = body;

    if (!name || !department || !designation) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Name, department and designation are required",
        },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        nameNe: nameNe || name,
        department,
        departmentNe: departmentNe || department,
        designation,
        designationNe: designationNe || designation,
        image: image || "",
        bio: bio || "",
        bioNe: bioNe || bio || "",
        email: email || "",
        phone: phone || "",
        newsEmail: newsEmail || "",
        facebook: facebook || "",
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: member,
        message: "Team member created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}