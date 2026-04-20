import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/middleware";
import { cachedApi } from "@/lib/redis";

const CACHE_TTL = 600; // 10 minutes

function formatPhotoGalleries(galleries: any[]) {
  return galleries.map(gallery => ({
    ...gallery,
    coverImage: gallery.coverImage
      ? { ...gallery.coverImage, url: gallery.coverImage.url }
      : null,
    photos: (gallery.photos || []).map((p: any) => ({
      id: p.id,
      order: p.order,
      captionNe: p.captionNe,
      captionEn: p.captionEn,
      media: {
        id: p.media.id,
        filename: p.media.filename,
        url: p.media.url,
        type: p.media.type,
        altText: p.media.altText,
      },
    })),
  }));
}

// GET /api/photo-galleries - List published photo galleries (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;

    const cacheKey = `photo-galleries:list:${page}:${limit}:${search || ""}`;

    const result = await cachedApi(
      cacheKey,
      { page, limit, search },
      async () => {
        const where: Record<string, unknown> = {
          isPublished: true,
        };

        if (search) {
          where.OR = [
            { titleNe: { contains: search, mode: "insensitive" } },
            { titleEn: { contains: search, mode: "insensitive" } },
          ];
        }

        const [galleries, total] = await Promise.all([
          prisma.photoGallery.findMany({
            where,
            select: {
              id: true,
              slug: true,
              titleNe: true,
              titleEn: true,
              excerptNe: true,
              excerptEn: true,
              isPublished: true,
              createdAt: true,
              coverImage: {
                select: {
                  id: true,
                  url: true,
                  filename: true,
                },
              },
              author: {
                select: {
                  id: true,
                  name: true,
                  nameNe: true,
                  profilePhoto: true,
                },
              },
              photos: {
                include: {
                  media: {
                    select: {
                      id: true,
                      filename: true,
                      url: true,
                      type: true,
                      altText: true,
                    },
                  },
                },
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.photoGallery.count({ where }),
        ]);

        return {
          data: formatPhotoGalleries(galleries),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      },
      CACHE_TTL,
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Photo galleries retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
