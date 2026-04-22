import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  authMiddleware,
  roleMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/admin/team-members/:id - Get single team member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.ADMIN,
      Role.SUPERADMIN,
      Role.AUTHOR,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const { id } = await params;

    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, data: null, message: "Team member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
      message: "Team member retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/admin/team-members/:id - Update team member
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, message: "Team member not found" },
        { status: 404 },
      );
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name || existing.name,
        nameNe: body.nameNe || existing.nameNe,
        department: body.department || existing.department,
        departmentNe: body.departmentNe || existing.departmentNe,
        designation: body.designation || existing.designation,
        designationNe: body.designationNe || existing.designationNe,
        image: body.image !== undefined ? body.image : existing.image,
        bio: body.bio !== undefined ? body.bio : existing.bio,
        bioNe: body.bioNe !== undefined ? body.bioNe : existing.bioNe,
        email: body.email !== undefined ? body.email : existing.email,
        phone: body.phone !== undefined ? body.phone : existing.phone,
        newsEmail:
          body.newsEmail !== undefined ? body.newsEmail : existing.newsEmail,
        facebook:
          body.facebook !== undefined ? body.facebook : existing.facebook,
        order: body.order !== undefined ? body.order : existing.order,
        isActive:
          body.isActive !== undefined ? body.isActive : existing.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      data: member,
      message: "Team member updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/admin/team-members/:id - Delete team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const existing = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, data: null, message: "Team member not found" },
        { status: 404 },
      );
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
