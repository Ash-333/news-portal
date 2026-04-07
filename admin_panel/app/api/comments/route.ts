import { NextRequest, NextResponse } from 'next/server'
import { CommentStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { commentSchema, paginationSchema } from '@/lib/validations'
import { authMiddleware, validationMiddleware, validateQueryParams, errorHandler, AuthenticatedRequest, checkRateLimitForRequest } from '@/lib/middleware'

// GET /api/comments - List approved comments (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pagination = validateQueryParams(searchParams, paginationSchema)
    const articleId = searchParams.get('articleId')

    if (!pagination.success) {
      return NextResponse.json(
        { success: false, data: { errors: pagination.errors }, message: 'Invalid query parameters' },
        { status: 400 }
      )
    }

    const page = pagination.data.page ?? 1
    const limit = pagination.data.limit ?? 20

    const where: Record<string, unknown> = { 
      status: CommentStatus.APPROVED,
      deletedAt: null,
      parentId: null, // Only top-level comments
    }
    if (articleId) where.articleId = articleId

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

// POST /api/comments - Create comment (authenticated)
export async function POST(req: NextRequest) {
  try {
    // Rate limiting for comments
    const rateLimit = await checkRateLimitForRequest(req, 'comments')
    if (!rateLimit.allowed) {
      return rateLimit.response!
    }

    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest



    const validation = await validationMiddleware(commentSchema)(req)
    if (validation instanceof NextResponse) return validation

    let { articleId, parentId, content } = validation as any

    // If articleSlug provided, get articleId from slug
    if (!articleId && (validation as any).articleSlug) {
      const article = await prisma.article.findUnique({
        where: { slug: (validation as any).articleSlug },
        select: { id: true }
      })
      if (article) {
        articleId = article.id
      }
    }

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, data: null, message: 'Article not found' },
        { status: 404 }
      )
    }

    // Check parent comment if provided
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })
      if (!parentComment || parentComment.parentId) {
        return NextResponse.json(
          { success: false, data: null, message: 'Invalid parent comment' },
          { status: 400 }
        )
      }
    }

    // Auto-approve all comments (admin can delete if needed)
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        userId: authenticatedReq.user!.id,
        parentId: parentId || null,
        status: CommentStatus.APPROVED,
      },
      include: {
        user: {
          select: { id: true, name: true, profilePhoto: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: comment,
      message: 'Comment posted successfully',
    }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
