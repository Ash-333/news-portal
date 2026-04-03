import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { videoSchema, paginationSchema, videoFilterSchema } from '@/lib/validations'
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest
} from '@/lib/middleware'

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// GET /api/admin/videos
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const { searchParams } = new URL(req.url)
    const pagination = validateQueryParams(searchParams, paginationSchema)
    const filters = validateQueryParams(searchParams, videoFilterSchema)

    if (!pagination.success) {
      return NextResponse.json(
        { success: false, data: { errors: pagination.errors }, message: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const { page = 1, limit = 20, sortBy, order = 'desc' } = pagination.data as any
    const { search, isPublished } = filters.success ? filters.data : {}

    const where: Record<string, unknown> = { deletedAt: null }
    if (isPublished !== undefined) where.isPublished = isPublished
    if (search) {
      where.OR = [
        { titleNe: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          youtubeUrl: true,
          thumbnailUrl: true,
          iframeUrl: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, name: true } },
        },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.video.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: videos,
      message: 'Videos retrieved successfully',
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// POST /api/admin/videos
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const validation = await validationMiddleware(videoSchema)(req)
    if (validation instanceof NextResponse) return validation

    const { titleNe, titleEn, youtubeUrl } = validation

    const videoId = extractYouTubeId(youtubeUrl as string)
    if (!videoId) {
      return NextResponse.json(
        { success: false, data: null, message: 'Invalid YouTube URL. Could not extract video ID.' },
        { status: 400 }
      )
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    const iframeUrl = `https://www.youtube.com/embed/${videoId}`

    const video = await prisma.video.create({
      data: {
        titleNe: titleNe as string,
        titleEn: titleEn as string,
        youtubeUrl: youtubeUrl as string,
        thumbnailUrl,
        iframeUrl,
        authorId: authenticatedReq.user!.id,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'VIDEO_CREATE',
        targetType: 'VIDEO',
        targetId: video.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: video,
      message: 'Video created successfully',
    }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
