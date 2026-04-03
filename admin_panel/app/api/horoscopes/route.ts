import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/horoscopes
// Returns all published horoscopes (not filtered by date)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const page = parseInt(searchParams.get("page") || "1");
    const zodiacSign = searchParams.get("zodiacSign") || "";

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    // Filter by zodiac sign if provided
    if (zodiacSign) {
      where.zodiacSign = zodiacSign;
    }

    // If no specific zodiac sign is requested, get all published horoscopes
    // (regardless of date - shows the latest content for all signs)
    const [horoscopes, total] = await Promise.all([
      prisma.horoscope.findMany({
        where,
        orderBy: { zodiacSign: "asc" },
        skip: (page - 1) * limit,
        take: limit,
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
          author: { select: { name: true } },
        },
      }),
      prisma.horoscope.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: horoscopes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Public Horoscopes API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
