import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  authMiddleware,
  roleMiddleware,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";
import { uploadToR2, deleteFile } from "@/lib/storage";

// Allowed audio file extensions
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/webm",
];
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Helper function to upload file
async function uploadFile(file: File, folder: string): Promise<string> {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
  const key = `uploads/${folder}/${uniqueSuffix}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  return await uploadToR2(buffer, key, file.type || "application/octet-stream");
}

// GET /api/admin/audio-news/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: "Audio news ID is required" },
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

    const audioNews = await prisma.audioNews.findFirst({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, nameEn: true, nameNe: true } },
      },
    });

    if (!audioNews) {
      return NextResponse.json(
        { success: false, data: null, message: "Audio news not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: audioNews,
      message: "Audio news retrieved successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/admin/audio-news/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: "Audio news ID is required" },
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

    const existing = await prisma.audioNews.findUnique({
      where: { id },
      select: { audioUrl: true, thumbnailUrl: true },
    });

    // Check content type to determine how to parse
    const contentType = req.headers.get("content-type") || "";
    let updateData: Record<string, unknown> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Extract fields from form data
      const titleNe = formData.get("titleNe") as string | null;
      const titleEn = formData.get("titleEn") as string | null;
      const descriptionNe = formData.get("descriptionNe") as string | null;
      const descriptionEn = formData.get("descriptionEn") as string | null;
      const categoryId = formData.get("categoryId") as string | null;
      const isPublished = formData.get("isPublished");
      const audioFile = formData.get("audioFile") as File | null;
      const thumbnailFile = formData.get("thumbnailFile") as File | null;
      const thumbnailUrl = formData.get("thumbnailUrl") as string | null;

      if (titleNe) updateData.titleNe = titleNe;
      if (titleEn) updateData.titleEn = titleEn;
      if (descriptionNe !== null)
        updateData.descriptionNe = descriptionNe || null;
      if (descriptionEn !== null)
        updateData.descriptionEn = descriptionEn || null;
      if (categoryId !== null) updateData.categoryId = categoryId || null;
      if (isPublished !== null) {
        updateData.isPublished = isPublished === "true";
        if (isPublished === "true") updateData.publishedAt = new Date();
      }

      // Handle audio file upload
      if (audioFile && audioFile.size > 0) {
        if (!ALLOWED_AUDIO_TYPES.includes(audioFile.type)) {
          return NextResponse.json(
            {
              success: false,
              data: null,
              message:
                "Invalid audio file type. Allowed: MP3, WAV, OGG, M4A, WebM",
            },
            { status: 400 },
          );
        }
        if (existing?.audioUrl) {
          await deleteFile(existing.audioUrl);
        }
        updateData.audioUrl = await uploadFile(audioFile, "audio");
      }

      // Handle thumbnail file upload
      if (thumbnailFile && thumbnailFile.size > 0) {
        if (!ALLOWED_IMAGE_TYPES.includes(thumbnailFile.type)) {
          return NextResponse.json(
            {
              success: false,
              data: null,
              message:
                "Invalid image file type for thumbnail. Allowed: JPEG, PNG, WebP, GIF",
            },
            { status: 400 },
          );
        }
        if (existing?.thumbnailUrl) {
          await deleteFile(existing.thumbnailUrl);
        }
        updateData.thumbnailUrl = await uploadFile(thumbnailFile, "images");
      } else if (thumbnailUrl) {
        // Use the provided thumbnail URL from media library
        updateData.thumbnailUrl = thumbnailUrl;
      }
    } else {
      // Handle JSON body
      const body = await req.json();

      if (body.titleNe !== undefined) updateData.titleNe = body.titleNe;
      if (body.titleEn !== undefined) updateData.titleEn = body.titleEn;
      if (body.descriptionNe !== undefined)
        updateData.descriptionNe = body.descriptionNe;
      if (body.descriptionEn !== undefined)
        updateData.descriptionEn = body.descriptionEn;
      if (body.audioUrl !== undefined) updateData.audioUrl = body.audioUrl;
      if (body.thumbnailUrl !== undefined)
        updateData.thumbnailUrl = body.thumbnailUrl;
      if (body.categoryId !== undefined)
        updateData.categoryId = body.categoryId || null;
      if (body.isPublished !== undefined) {
        updateData.isPublished = body.isPublished;
        if (body.isPublished) updateData.publishedAt = new Date();
      }
    }

    const audioNews = await prisma.audioNews.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "AUDIO_NEWS_UPDATE",
        targetType: "AUDIO_NEWS",
        targetId: id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: audioNews,
      message: "Audio news updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/admin/audio-news/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, data: null, message: "Audio news ID is required" },
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

    const existing = await prisma.audioNews.findUnique({
      where: { id },
      select: { audioUrl: true, thumbnailUrl: true },
    });

    await prisma.audioNews.delete({
      where: { id },
    });

    if (existing?.audioUrl) {
      await deleteFile(existing.audioUrl);
    }
    if (existing?.thumbnailUrl) {
      await deleteFile(existing.thumbnailUrl);
    }

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "AUDIO_NEWS_DELETE",
        targetType: "AUDIO_NEWS",
        targetId: id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: "Audio news deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
