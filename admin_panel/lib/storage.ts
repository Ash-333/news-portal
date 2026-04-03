import { unlink } from 'fs/promises'
import path from 'path'

const PUBLIC_ROOT = path.join(process.cwd(), 'public')

function sanitizePath(targetPath: string): string {
  return targetPath
    .replace(/\\/g, '/')
    .split('/')
    .filter((segment) => segment && segment !== '.' && segment !== '..')
    .join('/')
}

function getPublicUrl(key: string): string {
  return `/${key.replace(/\\/g, '/')}`
}

export async function deleteFile(key: string): Promise<void> {
  const safeKey = sanitizePath(key)

  if (!safeKey) {
    return
  }

  const absolutePath = path.join(PUBLIC_ROOT, safeKey)

  try {
    await unlink(absolutePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}

export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300
): Promise<string> {
  void contentType
  void expiresIn
  return getPublicUrl(sanitizePath(key))
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  void expiresIn
  return getPublicUrl(sanitizePath(key))
}

export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type)
}

export function validateFileSize(
  file: File,
  maxSize: number
): boolean {
  return file.size <= maxSize
}

export function getFileTypeCategory(mimeType: string): 'image' | 'video' | 'document' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'text/plain'
  ) {
    return 'document'
  }
  return 'other'
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
]

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

export const ALLOWED_ALL_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
]

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024
