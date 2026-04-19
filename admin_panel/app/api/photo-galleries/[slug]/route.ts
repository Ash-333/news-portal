import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/middleware";
import { cachedApi } from "@/lib/redis";

const CACHE_TTL = 600; // 10 minutes

function formatPhotoGallery(gallery: any) {
  return {
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
  };
}

// GET /api/photo-galleries/[slug] - Get single published photo gallery (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await cachedApi(
      `photo-galleries:detail:${slug}`,
      {},
      async () => {
        const gallery = await prisma.photoGallery.findFirst({
          where: { slug, isPublished: true },
          include: {
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
        });

        if (!gallery) return null;

        return formatPhotoGallery(gallery);
      },
      CACHE_TTL,
    );

    if (!result) {
      return NextResponse.json(
        { success: false, data: null, message: "Photo gallery not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Photo gallery retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
