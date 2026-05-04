import { NextRequest, NextResponse } from "next/server";
import { authMiddleware, roleMiddleware } from "@/lib/middleware";
import type { AuthenticatedRequest } from "@/lib/middleware";
import { authorSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

// GET /api/admin/authors - List all authors (admin)
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: { articles: true },
          },
        },
      }),
      prisma.author.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: authors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

// POST /api/admin/authors - Create new author (admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validation = authorSchema.safeParse(body);

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

    const author = await prisma.author.create({
      data: {
        name: data.name,
        bio: data.bio || null,
        image: data.image || null,
        email: data.email || null,
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json(
      { success: true, data: author, message: "Author created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating author:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create author" },
      { status: 500 }
    );
  }
}
