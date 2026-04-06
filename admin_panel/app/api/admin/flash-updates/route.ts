import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { flashUpdateSchema, paginationSchema, flashUpdateFilterSchema } from '@/lib/validations'
import {
  authMiddleware,
  roleMiddleware,
  validationMiddleware,
  validateQueryParams,
  errorHandler,
  AuthenticatedRequest
} from '@/lib/middleware'

// GET /api/admin/flash-updates
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const { searchParams } = new URL(req.url)
    const pagination = validateQueryParams(searchParams, paginationSchema)
    const filters = validateQueryParams(searchParams, flashUpdateFilterSchema)

    if (!pagination.success) {
      return NextResponse.json(
        { success: false, data: { errors: pagination.errors }, message: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const { page = 1, limit = 20, sortBy, order = 'desc' } = pagination.data as any
    const { search, isPublished, activeOnly } = filters.success ? filters.data : {}

    const where: Record<string, unknown> = { deletedAt: null }
    if (isPublished !== undefined) where.isPublished = isPublished
    if (activeOnly) {
      where.isPublished = true
    }
    if (search) {
      where.OR = [
        { titleNe: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
      ]
    }

    const origin = process.env.APP_URL || req.nextUrl.origin

    const [updates, total] = await Promise.all([
      prisma.flashUpdate.findMany({
        where,
        select: {
          id: true,
          titleNe: true,
          titleEn: true,
          slug: true,
          excerptNe: true,
          excerptEn: true,
          isPublished: true,
          publishedAt: true,
          expiresAt: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, name: true, profilePhoto: true } },
          featuredImage: { select: { id: true, url: true } },
        },
        orderBy: sortBy ? { [sortBy]: order } : { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.flashUpdate.count({ where }),
    ])

    const formattedUpdates = updates.map((u: any) => ({
      ...u,
      featuredImage: u.featuredImage ? { ...u.featuredImage, url: `${origin}${u.featuredImage.url}` } : null,
    }))

    return NextResponse.json({
      success: true,
      data: formattedUpdates,
      message: 'Flash updates retrieved successfully',
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// POST /api/admin/flash-updates
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const validation = await validationMiddleware(flashUpdateSchema)(req)
    if (validation instanceof NextResponse) return validation

    const { featuredImageId, ...rest } = validation

    const updateData: Record<string, unknown> = { ...rest }
    if (featuredImageId && featuredImageId !== '') {
      updateData.featuredImageId = featuredImageId
    }

    // Generate slug from English title
    const baseSlug = (updateData.titleEn as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    let slug = baseSlug
    let counter = 1
    while (await prisma.flashUpdate.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const flashUpdate = await prisma.flashUpdate.create({
      data: {
        ...(updateData as any),
        slug,
        authorId: authenticatedReq.user!.id,
        isPublished: true,
        publishedAt: new Date(),
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'FLASH_UPDATE_CREATE',
        targetType: 'FLASH_UPDATE',
        targetId: flashUpdate.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: flashUpdate,
      message: 'Flash update created successfully',
    }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
