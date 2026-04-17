import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

const PUBLIC_URL = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");

function sanitizePath(key: string): string {
  return key
    .replace(/\\/g, "/")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");
}

export async function uploadToR2(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType: string,
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

export async function deleteFile(keyOrUrl: string): Promise<void> {
  const raw = keyOrUrl.startsWith(PUBLIC_URL)
    ? keyOrUrl.slice(PUBLIC_URL.length + 1)
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
    if ((error as { Code?: string }).Code !== "NoSuchKey") {
      throw error;
    }
  }
}

export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300,
): Promise<string> {
  void contentType;
  void expiresIn;
  return `${PUBLIC_URL}/${sanitizePath(key)}`;
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600,
): Promise<string> {
  void expiresIn;
  return `${PUBLIC_URL}/${sanitizePath(key)}`;
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

export function getFileTypeCategory(
  mimeType: string,
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

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
