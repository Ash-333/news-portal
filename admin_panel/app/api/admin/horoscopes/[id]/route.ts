import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  authMiddleware,
  roleMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";

// GET /api/admin/horoscopes/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: "Horoscope ID is required" },
        { status: 400 },
      );
    }

    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.AUTHOR,
      Role.ADMIN,
      Role.SUPERADMIN,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) return roleResult;

    const horoscope = await prisma.horoscope.findFirst({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });

    if (!horoscope) {
      return NextResponse.json(
        { success: false, data: null, message: "Horoscope not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: horoscope,
      message: "Horoscope retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/admin/horoscopes/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: "Horoscope ID is required" },
        { status: 400 },
      );
    }

    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) return roleResult;

    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.zodiacSign !== undefined) updateData.zodiacSign = body.zodiacSign;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.titleNe !== undefined) updateData.titleNe = body.titleNe;
    if (body.titleEn !== undefined) updateData.titleEn = body.titleEn;
    if (body.contentNe !== undefined) updateData.contentNe = body.contentNe;
    if (body.contentEn !== undefined) updateData.contentEn = body.contentEn;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.isPublished !== undefined)
      updateData.isPublished = body.isPublished;

    const horoscope = await prisma.horoscope.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "HOROSCOPE_UPDATE",
        targetType: "HOROSCOPE",
        targetId: id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: horoscope,
      message: "Horoscope updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/admin/horoscopes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: "Horoscope ID is required" },
        { status: 400 },
      );
    }

    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(
      authenticatedReq,
    );
    if (roleResult instanceof NextResponse) return roleResult;

    await prisma.horoscope.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "HOROSCOPE_DELETE",
        targetType: "HOROSCOPE",
        targetId: id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Horoscope deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
