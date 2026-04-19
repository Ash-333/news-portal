import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  photoGallerySchema,
  paginationSchema,
} from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";
import { deleteCachedPattern } from "@/lib/redis";

// GET /api/admin/photo-galleries - List all photo galleries (Admin+)
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);

    if (!pagination.success) {
      return NextResponse.json(
        {
          success: false,
          data: { errors: pagination.errors },
          message: "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    const { page = 1, limit = 20, sortBy, order } = pagination.data;

    const where: Record<string, unknown> = {};

    // Authors can only see their own galleries
    if (authenticatedReq.user?.role === Role.AUTHOR) {
      where.authorId = authenticatedReq.user.id;
    }

    // Get galleries with photos count
    const [galleries, total] = await Promise.all([
      prisma.photoGallery.findMany({
        where,
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          slug: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              profilePhoto: true,
            },
          },
          coverImage: {
            select: {
              id: true,
              url: true,
              filename: true,
            },
          },
          _count: {
            select: {
              photos: true,
            },
          },
        },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.photoGallery.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: galleries,
      message: "Photo galleries retrieved successfully",
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

// POST /api/admin/photo-galleries - Create photo gallery (Author+)
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.AUTHOR,
      Role.ADMIN,
      Role.SUPERADMIN,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) {
      return roleResult;
    }

    const validation = await validationMiddleware(photoGallerySchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { titleNe, titleEn, excerptNe, excerptEn, isPublished, coverImageId, photos } = validation;

    // Generate slug from English title
    const baseSlug = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.photoGallery.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create gallery with photos in transaction
    const gallery = await prisma.$transaction(async (tx) => {
      const createdGallery = await tx.photoGallery.create({
        data: {
          titleNe,
          titleEn,
          excerptNe: excerptNe || null,
          excerptEn: excerptEn || null,
          slug,
          authorId: authenticatedReq.user!.id,
          isPublished: Boolean(isPublished),
          coverImageId: coverImageId || null,
          photos: {
            create: photos.map((photo, index) => ({
              mediaId: photo.mediaId,
              captionNe: photo.captionNe || null,
              captionEn: photo.captionEn || null,
              order: photo.order ?? index,
            })),
          },
        },
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          slug: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return createdGallery;
    });

    await deleteCachedPattern("photo-galleries:");

    return NextResponse.json(
      {
        success: true,
        data: gallery,
        message: "Photo gallery created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
