import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/authors - List all active authors (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");

    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.author.count({ where: { isActive: true } }),
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
