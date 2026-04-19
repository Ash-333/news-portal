import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  photoGallerySchema,
} from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";
import { deleteCachedPattern } from "@/lib/redis";

// GET /api/admin/photo-galleries/[id] - Get single photo gallery
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const gallery = await prisma.photoGallery.findUnique({
      where: { id },
      include: {
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

    if (!gallery) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Photo gallery not found",
        },
        { status: 404 }
      );
    }

    // Authors can only access their own galleries
    if (authenticatedReq.user?.role === Role.AUTHOR && gallery.authorId !== authenticatedReq.user.id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gallery,
      message: "Photo gallery retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/admin/photo-galleries/[id] - Update photo gallery
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const validation = await validationMiddleware(photoGallerySchema)(req);
    if (validation instanceof NextResponse) {
      return validation;
    }

    const { titleNe, titleEn, excerptNe, excerptEn, isPublished, coverImageId, photos } = validation;

    // Check if gallery exists and user has permission
    const existingGallery = await prisma.photoGallery.findUnique({
      where: { id },
    });

    if (!existingGallery) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Photo gallery not found",
        },
        { status: 404 }
      );
    }

    // Authors can only edit their own galleries
    if (
      authenticatedReq.user?.role === Role.AUTHOR &&
      existingGallery.authorId !== authenticatedReq.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    // Update gallery with photos in transaction
    const updatedGallery = await prisma.$transaction(async (tx) => {
      // Delete existing photos
      await tx.photoGalleryPhoto.deleteMany({
        where: { photoGalleryId: id },
      });

      // Update gallery
      const gallery = await tx.photoGallery.update({
        where: { id },
        data: {
          titleNe,
          titleEn,
          excerptNe: excerptNe || null,
          excerptEn: excerptEn || null,
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

      return gallery;
    });

    await deleteCachedPattern("photo-galleries:");

    return NextResponse.json({
      success: true,
      data: updatedGallery,
      message: "Photo gallery updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/admin/photo-galleries/[id] - Delete photo gallery
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Check if gallery exists and user has permission
    const existingGallery = await prisma.photoGallery.findUnique({
      where: { id },
    });

    if (!existingGallery) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Photo gallery not found",
        },
        { status: 404 }
      );
    }

    // Authors can only delete their own galleries
    if (
      authenticatedReq.user?.role === Role.AUTHOR &&
      existingGallery.authorId !== authenticatedReq.user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Unauthorized",
        },
        { status: 403 }
      );
    }

    await prisma.photoGallery.delete({
      where: { id },
    });

    await deleteCachedPattern("photo-galleries:");

    return NextResponse.json({
      success: true,
      data: null,
      message: "Photo gallery deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
