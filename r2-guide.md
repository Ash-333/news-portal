# Cloudflare R2 Migration Guide

This document guides AI agents on how to migrate file/media storage from local filesystem to Cloudflare R2.

---

## Current State (Local Storage)

### Upload Points

There are two separate upload flows:

**1. Media Library** (`pages/api/admin/media.ts`)
- Uses `multer` with disk storage
- Saves files to `public/uploads/news/<year>/<month>/<uuid>.<ext>`
- Creates a `Media` record in the database with a relative URL e.g. `/uploads/news/2024/01/uuid.jpg`
- Used by articles and flash updates via `featuredImageId`

**2. Audio News** (`app/api/admin/audio-news/route.ts` and `app/api/admin/audio-news/[id]/route.ts`)
- Uses a custom `uploadFile()` function
- Saves audio files to `public/uploads/audio/`
- Saves thumbnail images to `public/uploads/images/`
- Stores URLs directly on the `AudioNews` record as plain strings

### File Deletion

`lib/storage.ts` exports a `deleteFile()` function that deletes files from the local filesystem by resolving a relative path against `PUBLIC_ROOT`.

### URL Pattern

| Source | Example URL stored in DB |
|---|---|
| Media library | `/uploads/news/2024/01/uuid.jpg` |
| Audio news audio | `/uploads/audio/1718000000000-file.mp3` |
| Audio news thumbnail | `/uploads/images/1718000000000-thumb.jpg` |

These relative URLs are prefixed with `${origin}` in API responses to make them absolute.

---

## Migration Steps to Cloudflare R2

### Step 1: Set Up Cloudflare R2

1. Create or log in to your Cloudflare account at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage** in the sidebar
3. Click **Create bucket** and name it (e.g. `news-portal-media`)
4. After creation, go to the **Settings** tab of your bucket
5. Under **Public Access**, click **Allow Access** to make the bucket publicly readable
6. Note the **Public Bucket URL** — it looks like:
   ```
   https://pub-<hash>.r2.dev
   ```
7. Navigate to **Manage R2 API Tokens** from the R2 overview page
8. Click **Create API Token** with the following permissions:
   - **Permissions:** Object Read & Write
   - **Bucket:** Restrict to your specific bucket
9. Save the following credentials:
   - Access Key ID
   - Secret Access Key
   - Account ID (found in the right sidebar of your Cloudflare dashboard)

---

### Step 2: Install Dependencies

```bash
npm install @aws-sdk/client-s3
```

> `mime-types` is not needed — the media library already receives the MIME type from `multer` via `file.mimetype`, and the audio news route already has its own allowed types list with explicit MIME type checks.

---

### Step 3: Add Environment Variables

Add to `admin_panel/.env.local`:

```env
# R2 Storage - S3-compatible endpoint for SDK operations only
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# R2 Public URL - stored in the database, returned to browsers
R2_PUBLIC_URL=https://pub-<hash>.r2.dev

# R2 Credentials
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=news-portal-media
```

> **Important:** `R2_ENDPOINT` and `R2_PUBLIC_URL` are two different URLs:
> - `R2_ENDPOINT` is used only by the AWS SDK to perform operations (upload, delete). Never exposed to the browser.
> - `R2_PUBLIC_URL` is what gets stored in the database and returned to clients for loading files in the browser.

---

### Step 4: Configure CORS on the R2 Bucket

1. Go to your bucket in the Cloudflare Dashboard
2. Click the **Settings** tab
3. Scroll to **CORS Policy** and add the following:

```json
[
  {
    "AllowedOrigins": [
      "https://yournewsportal.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

Replace `https://yournewsportal.com` with your actual production domain.

---

### Step 5: Replace `lib/storage.ts`

The current `lib/storage.ts` contains local filesystem logic. Replace the entire file with R2 equivalents while keeping the same exported function names and signatures so nothing else in the codebase breaks.

**File:** `lib/storage.ts`

```typescript
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// ---------------------------------------------------------------------------
// Validate required environment variables at startup
// ---------------------------------------------------------------------------
const requiredEnvVars = [
  "R2_ENDPOINT",
  "R2_PUBLIC_URL",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// ---------------------------------------------------------------------------
// R2 client — used only for SDK operations, never exposed to the browser
// ---------------------------------------------------------------------------
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

// Strip trailing slash to avoid double slashes in constructed URLs
const PUBLIC_URL = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Sanitizes a key by removing path traversal sequences and normalizing slashes.
 * Example: "uploads/../news/file.jpg" → "uploads/news/file.jpg"
 */
function sanitizePath(key: string): string {
  return key
    .replace(/\\/g, "/")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");
}

// ---------------------------------------------------------------------------
// Core R2 operations
// ---------------------------------------------------------------------------

/**
 * Uploads a buffer to R2 and returns the public browser-accessible URL.
 * The returned URL is what gets stored in the database.
 *
 * @param buffer - File content as a Buffer or Uint8Array
 * @param key - R2 object key e.g. "uploads/news/2024/01/uuid.jpg"
 * @param contentType - MIME type e.g. "image/jpeg"
 * @returns Full public URL e.g. "https://pub-xxx.r2.dev/uploads/news/2024/01/uuid.jpg"
 */
export async function uploadToR2(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<string> {
  const safeKey = sanitizePath(key);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: safeKey,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  return `${PUBLIC_URL}/${safeKey}`;
}

/**
 * Deletes a file from R2.
 * Accepts either a relative key ("uploads/news/2024/01/uuid.jpg")
 * or a full public URL ("https://pub-xxx.r2.dev/uploads/news/2024/01/uuid.jpg").
 * Silently ignores attempts to delete non-existent files.
 */
export async function deleteFile(keyOrUrl: string): Promise<void> {
  // If given a full URL, strip the public URL prefix to get the key
  const raw = keyOrUrl.startsWith(PUBLIC_URL)
    ? keyOrUrl.slice(PUBLIC_URL.length + 1) // +1 for the leading slash
    : keyOrUrl;

  const safeKey = sanitizePath(raw);

  if (!safeKey) {
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: safeKey,
  });

  try {
    await r2Client.send(command);
  } catch (error) {
    // Ignore "key does not exist" errors, same behaviour as the old local deleteFile
    if ((error as { Code?: string }).Code !== "NoSuchKey") {
      throw error;
    }
  }
}

// ---------------------------------------------------------------------------
// File validation helpers — unchanged from the original storage.ts
// ---------------------------------------------------------------------------

export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(
  file: File,
  maxSize: number
): boolean {
  return file.size <= maxSize;
}

export function getFileTypeCategory(
  mimeType: string
): "image" | "video" | "document" | "other" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "text/plain"
  ) {
    return "document";
  }
  return "other";
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const ALLOWED_ALL_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;   // 10 MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100 MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10 MB
```

---

### Step 6: Update the Media Library Endpoint

The media library endpoint (`pages/api/admin/media.ts`) currently uses `multer` with disk storage and then derives a relative URL from the file path. Replace it to use `uploadToR2` instead.

**File:** `pages/api/admin/media.ts`

```typescript
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
  buffer: Buffer; // memory storage gives us a buffer instead of a path
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

// ---------------------------------------------------------------------------
// Use memory storage — multer holds the file in memory so we can pass the
// buffer directly to uploadToR2. No files are written to disk.
// ---------------------------------------------------------------------------
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
  payload: ApiResponse<T>
): void {
  res.status(status).json(payload);
}

async function authenticate(
  req: NextApiRequest
): Promise<AuthedRequest | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return null;

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

  if (Array.isArray(forwarded)) return forwarded[0] ?? null;

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
  res: NextApiResponse<ApiResponse<unknown>>
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
  const type =
    typeof typeParam === "string" ? (typeParam as MediaType) : null;

  if (!validation.success) {
    sendJson(res, 400, {
      success: false,
      data: { errors: validation.error.flatten() },
      message: "Invalid query parameters",
    });
    return;
  }

  const { page, limit } = validation.data;
  const search =
    typeof req.query.search === "string" ? req.query.search : null;
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
  res: NextApiResponse<ApiResponse<unknown>>
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
    // No local file to clean up — multer memory storage discards the buffer automatically
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

  // Build the R2 key using the same folder structure as before
  // e.g. "uploads/news/2024/01/<uuid>.jpg"
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ext = path.extname(uploadedFile.originalname);
  const key = `uploads/news/${year}/${month}/${uuidv4()}${ext}`;

  // Upload to R2 — returns the full public URL
  const r2Url = await uploadToR2(
    uploadedFile.buffer,
    key,
    uploadedFile.mimetype
  );

  let media;

  try {
    media = await prisma.media.create({
      data: {
        filename: uploadedFile.originalname,
        title: (req.body.title as string) || null,
        url: r2Url, // Full absolute R2 URL stored in the database
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
    // Upload succeeded but DB insert failed — clean up the R2 file
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
  res: NextApiResponse<ApiResponse<unknown>>
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
```

**Key changes from the original:**
- `multer.diskStorage` replaced with `multer.memoryStorage()` — files are held in memory as a buffer, never written to disk
- `uploadedFile.path` replaced with `uploadedFile.buffer` passed directly to `uploadToR2`
- The local `deleteFile` cleanup on DB failure now calls `deleteFile(r2Url)` which deletes from R2
- The `url` stored in the database is now a full absolute R2 URL instead of a relative path

---

### Step 7: Update Audio News Upload

Both `app/api/admin/audio-news/route.ts` and `app/api/admin/audio-news/[id]/route.ts` have the same local `uploadFile()` function. Replace it in both files.

#### 7.1 Replace imports in both files

```typescript
// Remove these imports
- import { writeFile, mkdir } from "fs/promises";
- import path from "path";

// Add this import
+ import { uploadToR2 } from "@/lib/storage";
```

#### 7.2 Replace the `uploadFile` function in both files

```typescript
// ❌ Remove
async function uploadFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = path.join(
    process.env.UPLOAD_PATH || process.cwd(),
    "public",
    "uploads",
    folder
  );
  await mkdir(uploadDir, { recursive: true });
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const ext = path.extname(file.name);
  const filename = `${uniqueSuffix}${ext}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return `/uploads/${folder}/${filename}`;
}

// ✅ Replace with
async function uploadFile(file: File, folder: string): Promise<string> {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const ext = file.name.includes(".") ? `.${file.name.split(".").pop()}` : "";
  const key = `uploads/${folder}/${uniqueSuffix}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  return await uploadToR2(buffer, key, file.type || "application/octet-stream");
}
```

#### 7.3 Add file cleanup on delete (`app/api/admin/audio-news/[id]/route.ts`)

The current `DELETE` handler only removes the database record. Add R2 cleanup before deleting:

```typescript
// Add this import at the top
import { deleteFile } from "@/lib/storage";

// Inside the DELETE handler, before prisma.audioNews.delete():

// ✅ Add — fetch the record first so we have the file URLs
const existing = await prisma.audioNews.findUnique({
  where: { id },
  select: { audioUrl: true, thumbnailUrl: true },
});

await prisma.audioNews.delete({ where: { id } });

// ✅ Add — delete files from R2 after successful DB delete
if (existing?.audioUrl) {
  await deleteFile(existing.audioUrl);
}
if (existing?.thumbnailUrl) {
  await deleteFile(existing.thumbnailUrl);
}
```

#### 7.4 Add file cleanup on update (`app/api/admin/audio-news/[id]/route.ts`)

When a new audio or thumbnail file is uploaded during a PATCH, delete the old one from R2:

```typescript
// Add this import at the top
import { deleteFile } from "@/lib/storage";

// Inside the PATCH handler, fetch the existing record before processing files:
const existing = await prisma.audioNews.findUnique({
  where: { id },
  select: { audioUrl: true, thumbnailUrl: true },
});

// Then after uploadFile() calls, before prisma.audioNews.update():

// ✅ Add — delete old audio from R2 if a new one was uploaded
if (updateData.audioUrl && existing?.audioUrl) {
  await deleteFile(existing.audioUrl);
}

// ✅ Add — delete old thumbnail from R2 if a new one was uploaded
if (updateData.thumbnailUrl && existing?.thumbnailUrl) {
  await deleteFile(existing.thumbnailUrl);
}
```

---

### Step 8: Update URL Construction in API Responses

Since all new uploads now store full absolute R2 URLs in the database, the `${origin}` prefix that was previously needed for relative local URLs must be removed.

#### 8.1 Admin Articles API (`app/api/admin/articles/route.ts`)

```typescript
// ❌ Remove
featuredImage: article.featuredImage
  ? {
      ...article.featuredImage,
      url: `${origin}${article.featuredImage.url}`,
    }
  : null,

// ✅ Replace with
featuredImage: article.featuredImage
  ? {
      ...article.featuredImage,
      url: article.featuredImage.url, // Already a full absolute R2 URL
    }
  : null,
```

You can also remove the `origin` variable if it is no longer used anywhere else in that file:

```typescript
// Remove if unused
- const origin = process.env.APP_URL || req.nextUrl.origin;
```

#### 8.2 Public Articles API (`app/api/articles/route.ts`)

Apply the same change as 8.1.

#### 8.3 Public Articles by Slug (`app/api/articles/[slug]/route.ts`)

Apply the same change as 8.1.

#### 8.4 Admin Flash Updates API (`app/api/admin/flash-updates/route.ts`)

```typescript
// ❌ Remove
featuredImage: u.featuredImage
  ? { ...u.featuredImage, url: `${origin}${u.featuredImage.url}` }
  : null,

// ✅ Replace with
featuredImage: u.featuredImage
  ? { ...u.featuredImage, url: u.featuredImage.url } // Already a full absolute R2 URL
  : null,
```

Remove the `origin` variable if unused.

#### 8.5 Public Flash Updates API (`app/api/flash-updates/route.ts`)

Apply the same change as 8.4.

#### 8.6 Public Flash Updates by Slug (`app/api/flash-updates/[slug]/route.ts`)

Apply the same change as 8.4.

---

## Files Changed Summary

| File | Change |
|---|---|
| `admin_panel/.env.local` | Add R2 environment variables |
| `lib/storage.ts` | Replace entire file with R2 implementation |
| `pages/api/admin/media.ts` | Switch from disk storage to memory storage, upload to R2 |
| `app/api/admin/audio-news/route.ts` | Replace `uploadFile()` with R2 upload |
| `app/api/admin/audio-news/[id]/route.ts` | Replace `uploadFile()`, add R2 cleanup on update and delete |
| `app/api/admin/articles/route.ts` | Remove `${origin}` prefix from URL construction |
| `app/api/articles/route.ts` | Remove `${origin}` prefix from URL construction |
| `app/api/articles/[slug]/route.ts` | Remove `${origin}` prefix from URL construction |
| `app/api/admin/flash-updates/route.ts` | Remove `${origin}` prefix from URL construction |
| `app/api/flash-updates/route.ts` | Remove `${origin}` prefix from URL construction |
| `app/api/flash-updates/[slug]/route.ts` | Remove `${origin}` prefix from URL construction |

---

## Rollback Plan

If anything goes wrong, revert `lib/storage.ts` to the original local filesystem implementation and redeploy. New uploads will go back to local storage. R2 uploads that already happened will still be accessible via their absolute URLs stored in the database.

---

## Testing Checklist

**Setup**
- [ ] R2 bucket created and public access enabled
- [ ] Public bucket URL noted and set as `R2_PUBLIC_URL`
- [ ] CORS policy configured on the bucket
- [ ] Environment variables added to `.env.local`
- [ ] `@aws-sdk/client-s3` installed

**Media Library**
- [ ] Upload an image — verify it appears in the R2 bucket dashboard
- [ ] Upload a video — verify it appears in the R2 bucket dashboard
- [ ] Upload a document — verify it appears in the R2 bucket dashboard
- [ ] Verify the URL stored in the `Media` table starts with `https://pub-`

**Audio News**
- [ ] Create audio news with audio file and thumbnail — both appear in R2
- [ ] Update audio news with a new audio file — old audio removed from R2, new one present
- [ ] Update audio news with a new thumbnail — old thumbnail removed from R2, new one present
- [ ] Delete audio news — both audio and thumbnail removed from R2

**Articles and Flash Updates**
- [ ] Create an article with a featured image selected from the media library — image loads correctly in the public portal
- [ ] Create a flash update with a featured image — image loads correctly in the public portal

**Display**
- [ ] View article list — featured images load correctly
- [ ] View article by slug — featured image loads correctly
- [ ] View flash update list — featured images load correctly
- [ ] View flash update by slug — featured image loads correctly
- [ ] View audio news list — thumbnails and audio load correctly