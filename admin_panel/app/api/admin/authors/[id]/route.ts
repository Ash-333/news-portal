import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, roleMiddleware } from "@/lib/middleware";
import type { AuthenticatedRequest } from "@/lib/middleware";
import { authorSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

// GET /api/admin/authors/:id - Get single author (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Check role
    const roleResult = await roleMiddleware(["ADMIN", "SUPERADMIN", "AUTHOR"])(authenticatedReq);
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const { id } = await params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!author) {
      return NextResponse.json(
        { success: false, message: "Author not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: author });
  } catch (error) {
    console.error("Error fetching author:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch author" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/authors/:id - Update author (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Check role
    const roleResult = await roleMiddleware(["ADMIN", "SUPERADMIN"])(authenticatedReq);
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const { id } = await params;
    const body = await request.json();

    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      return NextResponse.json(
        { success: false, message: "Author not found" },
        { status: 404 }
      );
    }

    const validation = authorSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio || null;
    if (data.image !== undefined) updateData.image = data.image || null;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    const author = await prisma.author.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: author,
      message: "Author updated successfully",
    });
  } catch (error) {
    console.error("Error updating author:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update author" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/authors/:id - Delete author (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate
    const authResult = await authMiddleware(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    // Check role
    const roleResult = await roleMiddleware(["ADMIN", "SUPERADMIN"])(authenticatedReq);
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const { id } = await params;

    const existingAuthor = await prisma.author.findUnique({
      where: { id },
      include: { _count: { select: { articles: true } } },
    });

    if (!existingAuthor) {
      return NextResponse.json(
        { success: false, message: "Author not found" },
        { status: 404 }
      );
    }

    if (existingAuthor._count.articles > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete author with associated articles. Change author of articles first or deactivate instead.",
        },
        { status: 400 }
      );
    }

    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting author:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete author" },
      { status: 500 }
    );
  }
}
