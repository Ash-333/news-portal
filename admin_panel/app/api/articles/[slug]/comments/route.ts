import { NextRequest, NextResponse } from 'next/server'
import { CommentStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { paginationSchema } from '@/lib/validations'
import { validateQueryParams, errorHandler } from '@/lib/middleware'

// GET /api/articles/:slug/comments - Get comments for a specific article (public)
// The slug parameter can be either a slug string or an article ID (UUID)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(req.url)
    const pagination = validateQueryParams(searchParams, paginationSchema)

    if (!pagination.success) {
      return NextResponse.json(
        { success: false, data: { errors: pagination.errors }, message: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const page = pagination.data.page ?? 1
    const limit = pagination.data.limit ?? 20

    // Determine if slug is actually a UUID (article ID)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    // Find the article by ID or slug
    const article = await prisma.article.findFirst({
      where: isUuid 
        ? { id: slug, deletedAt: null }
        : { slug, deletedAt: null },
      select: { id: true },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Article not found' },
        { status: 404 }
      )
    }

    const where: Record<string, unknown> = {
      articleId: article.id,
      status: CommentStatus.APPROVED,
      deletedAt: null,
      parentId: null, // Only top-level comments
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, profilePhoto: true },
          },
          replies: {
            where: { status: CommentStatus.APPROVED, deletedAt: null },
            include: {
              user: {
                select: { id: true, name: true, profilePhoto: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: comments,
      message: 'Comments retrieved successfully',
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return errorHandler(error)
  }
}