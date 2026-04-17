import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Role, MediaType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { paginationSchema } from "@/lib/validations";
import {
  deleteFile,
  uploadToR2,
  getFileTypeCategory,
  ALLOWED_ALL_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_DOCUMENT_SIZE,
} from "@/lib/storage";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

type AuthedRequest = NextApiRequest & {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
  file?: UploadedFile;
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_ALL_TYPES.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_VIDEO_SIZE,
    files: 1,
  },
});

function sendJson<T>(
  res: NextApiResponse<ApiResponse<T>>,
  status: number,
  payload: ApiResponse<T>,
): void {
  res.status(status).json(payload);
}

async function authenticate(
  req: NextApiRequest,
): Promise<AuthedRequest | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return null;
  }

  const authedReq = req as AuthedRequest;
  authedReq.user = {
    id: token.id as string,
    email: token.email as string,
    name: token.name as string,
    role: token.role as Role,
  };

  return authedReq;
}

function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return userRole === Role.SUPERADMIN || allowedRoles.includes(userRole);
}

function getRequestIp(req: NextApiRequest): string | null {
  const forwarded = req.headers["x-forwarded-for"];

  if (Array.isArray(forwarded)) {
    return forwarded[0] ?? null;
  }

  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }

  return req.socket.remoteAddress ?? null;
}

function runMulter(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  return new Promise((resolve, reject) => {
    upload.single("file")(req as never, res as never, (error: unknown) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function handleGet(
  req: AuthedRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
): Promise<void> {
  if (!hasRole(req.user.role, [Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])) {
    sendJson(res, 403, {
      success: false,
      data: null,
      message: "Forbidden: Insufficient permissions",
    });
    return;
  }

  const validation = paginationSchema.safeParse(req.query);
  const typeParam = req.query.type;
  const type = typeof typeParam === "string" ? (typeParam as MediaType) : null;

  if (!validation.success) {
    sendJson(res, 400, {
      success: false,
      data: { errors: validation.error.flatten() },
      message: "Invalid query parameters",
    });
    return;
  }

  const { page, limit } = validation.data;
  const search = typeof req.query.search === "string" ? req.query.search : null;
  const where: Prisma.MediaWhereInput = {};

  if (type) where.type = type;

  if (search) {
    where.OR = [
      { filename: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
    ];
  }

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      include: {
        uploader: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.media.count({ where }),
  ]);

  sendJson(res, 200, {
    success: true,
    data: media,
    message: "Media retrieved successfully",
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

async function handlePost(
  req: AuthedRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
): Promise<void> {
  if (!hasRole(req.user.role, [Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])) {
    sendJson(res, 403, {
      success: false,
      data: null,
      message: "Forbidden: Insufficient permissions",
    });
    return;
  }

  await runMulter(req, res);

  const uploadedFile = req.file;
  if (!uploadedFile) {
    sendJson(res, 400, {
      success: false,
      data: null,
      message: "No file provided",
    });
    return;
  }

  const category = getFileTypeCategory(uploadedFile.mimetype);
  const maxSize =
    category === "image"
      ? MAX_IMAGE_SIZE
      : category === "video"
        ? MAX_VIDEO_SIZE
        : MAX_DOCUMENT_SIZE;

  if (uploadedFile.size > maxSize) {
    sendJson(res, 400, {
      success: false,
      data: null,
      message: `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
    });
    return;
  }

  let mediaType: MediaType = MediaType.DOCUMENT;
  if (category === "image") mediaType = MediaType.IMAGE;
  else if (category === "video") mediaType = MediaType.VIDEO;

  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ext = path.extname(uploadedFile.originalname);
  const key = `uploads/news/${year}/${month}/${uuidv4()}${ext}`;

  const r2Url = await uploadToR2(
    uploadedFile.buffer,
    key,
    uploadedFile.mimetype,
  );

  let media;

  try {
    media = await prisma.media.create({
      data: {
        filename: uploadedFile.originalname,
        title: (req.body.title as string) || null,
        url: r2Url,
        type: mediaType,
        size: uploadedFile.size,
        uploadedBy: req.user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: "MEDIA_UPLOAD",
        targetType: "MEDIA",
        targetId: media.id,
        ipAddress: getRequestIp(req),
        userAgent: req.headers["user-agent"] || null,
      },
    });
  } catch (error) {
    await deleteFile(r2Url);
    throw error;
  }

  sendJson(res, 201, {
    success: true,
    data: media,
    message: "Media uploaded successfully",
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
): Promise<void> {
  try {
    const authedReq = await authenticate(req);

    if (!authedReq) {
      sendJson(res, 401, {
        success: false,
        data: null,
        message: "Unauthorized",
      });
      return;
    }

    if (req.method === "GET") {
      await handleGet(authedReq, res);
      return;
    }

    if (req.method === "POST") {
      await handlePost(authedReq, res);
      return;
    }

    res.setHeader("Allow", "GET, POST");
    sendJson(res, 405, {
      success: false,
      data: null,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof multer.MulterError) {
      sendJson(res, 400, {
        success: false,
        data: null,
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? `File too large. Max size: ${MAX_VIDEO_SIZE / 1024 / 1024}MB`
            : error.message,
      });
      return;
    }

    if (error instanceof Error) {
      sendJson(res, 400, {
        success: false,
        data: null,
        message: error.message,
      });
      return;
    }

    sendJson(res, 500, {
      success: false,
      data: null,
      message: "An unexpected error occurred",
    });
  }
}
