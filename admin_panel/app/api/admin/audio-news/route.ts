import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginationSchema, audioNewsFilterSchema } from "@/lib/validations";
import {
  authMiddleware,
  roleMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest,
} from "@/lib/middleware";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(process.env.UPLOAD_PATH || process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const ext = path.extname(file.name);
  const filename = `${uniqueSuffix}${ext}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}

// GET /api/admin/audio-news
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.AUTHOR,
      Role.ADMIN,
      Role.SUPERADMIN,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) return roleResult;

    const { searchParams } = new URL(req.url);
    const pagination = validateQueryParams(searchParams, paginationSchema);
    const filters = validateQueryParams(searchParams, audioNewsFilterSchema);

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

    const {
      page = 1,
      limit = 20,
      sortBy,
      order = "desc",
    } = pagination.data as any;
    const { search, categoryId, isPublished } = filters.success
      ? filters.data
      : {};

    const where: Record<string, unknown> = {};
    if (isPublished !== undefined) where.isPublished = isPublished;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { titleNe: { contains: search, mode: "insensitive" } },
        { titleEn: { contains: search, mode: "insensitive" } },
        { descriptionNe: { contains: search, mode: "insensitive" } },
        { descriptionEn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [audioNewsList, total] = await Promise.all([
      prisma.audioNews.findMany({
        where,
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          descriptionNe: true,
          descriptionEn: true,
          audioUrl: true,
          thumbnailUrl: true,
          categoryId: true,
          isPublished: true,
          viewCount: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, name: true } },
          category: { select: { id: true, nameEn: true, nameNe: true } },
        },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.audioNews.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: audioNewsList,
      message: "Audio news retrieved successfully",
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/admin/audio-news
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    const authenticatedReq = authResult as AuthenticatedRequest;

    const roleResult = await roleMiddleware([
      Role.AUTHOR,
      Role.ADMIN,
      Role.SUPERADMIN,
    ])(authenticatedReq);
    if (roleResult instanceof NextResponse) return roleResult;

    const formData = await req.formData();

    // Extract fields from form data
    const titleNe = formData.get("titleNe") as string;
    const titleEn = formData.get("titleEn") as string;
    const descriptionNe = formData.get("descriptionNe") as string | null;
    const descriptionEn = formData.get("descriptionEn") as string | null;
    const categoryId = formData.get("categoryId") as string | null;
    const isPublished = formData.get("isPublished") === "true";
    const audioFile = formData.get("audioFile") as File | null;
    const thumbnailFile = formData.get("thumbnailFile") as File | null;
    const thumbnailUrl = formData.get("thumbnailUrl") as string | null;

    // Validate required fields
    if (!titleNe || !titleEn) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Title (English) and Title (Nepali) are required",
        },
        { status: 400 },
      );
    }

    let audioUrl = "";
    let thumbnailUrlValue = "";

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
      audioUrl = await uploadFile(audioFile, "audio");
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
      thumbnailUrlValue = await uploadFile(thumbnailFile, "images");
    } else if (thumbnailUrl) {
      // Use the provided thumbnail URL from media library
      thumbnailUrlValue = thumbnailUrl;
    }

    const audioNews = await prisma.audioNews.create({
      data: {
        titleNe,
        titleEn,
        descriptionNe: descriptionNe || undefined,
        descriptionEn: descriptionEn || undefined,
        audioUrl,
        thumbnailUrl: thumbnailUrlValue || undefined,
        categoryId: categoryId || undefined,
        isPublished,
        authorId: authenticatedReq.user!.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: "AUDIO_NEWS_CREATE",
        targetType: "AUDIO_NEWS",
        targetId: audioNews.id,
        ipAddress: req.headers.get("x-forwarded-for") || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: audioNews,
        message: "Audio news created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
