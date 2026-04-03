import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  updateUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/users/:id - Get user detail (Admin+)
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

    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        profilePhoto: true,
        bio: true,
        language: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, data: null, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/users/:id - Update user (SuperAdmin for role/status, user for own profile)
export async function PATCH(
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

    const { id } = await params;
    const isOwnProfile = authenticatedReq.user?.id === id;
    const isSuperAdmin = authenticatedReq.user?.role === Role.SUPERADMIN;

    // Only SuperAdmin can update other users' role/status
    // Users can update their own profile (name, bio, etc.)
    if (!isOwnProfile && !isSuperAdmin) {
      return NextResponse.json(
        { success: false, data: null, message: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await req.json();

    // If updating role, validate with role schema
    if (body.role !== undefined) {
      if (!isSuperAdmin) {
        return NextResponse.json(
          {
            success: false,
            data: null,
            message: "Only SuperAdmin can change roles",
          },
          { status: 403 },
        );
      }
      const validation = updateUserRoleSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            data: { errors: validation.error.errors },
            message: "Validation failed",
          },
          { status: 422 },
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: validation.data.role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: authenticatedReq.user!.id,
          action: "USER_ROLE_UPDATE",
          targetType: "USER",
          targetId: id,
          ipAddress: req.headers.get('x-forwarded-for') || null,
          userAgent: req.headers.get("user-agent") || null,
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: "User role updated successfully",
      });
    }

    // If updating status
    if (body.status !== undefined) {
      if (!isSuperAdmin && authenticatedReq.user?.role !== Role.ADMIN) {
        return NextResponse.json(
          { success: false, data: null, message: "Forbidden" },
          { status: 403 },
        );
      }

      // Admins can only suspend Authors, not other Admins or SuperAdmins
      if (authenticatedReq.user?.role === Role.ADMIN && !isSuperAdmin) {
        const targetUser = await prisma.user.findUnique({
          where: { id },
          select: { role: true },
        });
        if (targetUser?.role !== Role.AUTHOR) {
          return NextResponse.json(
            {
              success: false,
              data: null,
              message: "Admins can only suspend Authors",
            },
            { status: 403 },
          );
        }
      }

      const validation = updateUserStatusSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            data: { errors: validation.error.errors },
            message: "Validation failed",
          },
          { status: 422 },
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { status: validation.data.status },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: authenticatedReq.user!.id,
          action: `USER_${validation.data.status === "ACTIVE" ? "REACTIVATE" : "SUSPEND"}`,
          targetType: "USER",
          targetId: id,
          ipAddress: req.headers.get('x-forwarded-for') || null,
          userAgent: req.headers.get("user-agent") || null,
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: "User status updated successfully",
      });
    }

    // Regular profile update
    const validation = await validationMiddleware(updateUserSchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validation,
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profilePhoto: true,
        language: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/users/:id - Soft delete user (SuperAdmin only)
export async function DELETE(
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

    // Check role - SuperAdmin only
    const roleResult = await roleMiddleware([Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const { id } = await params;

    // Prevent self-deletion
    if (authenticatedReq.user?.id === id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Cannot delete your own account",
        },
        { status: 400 },
      );
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: `deleted_${id}@deleted.com`, // Anonymize email
        status: "BANNED",
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "USER_DELETE",
        targetType: "USER",
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "User deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
