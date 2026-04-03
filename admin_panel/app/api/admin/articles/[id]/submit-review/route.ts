import { NextRequest, NextResponse } from 'next/server'
import { Role, ArticleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// PATCH /api/admin/articles/:id/submit-review - Submit article for review (Author)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const { id } = await params

    // Get article
    const article = await prisma.article.findUnique({
      where: { id, deletedAt: null },
      select: { authorId: true, status: true },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, data: null, message: 'Article not found' },
        { status: 404 }
      )
    }

    // Authors can only submit their own articles
    if (authenticatedReq.user?.role === Role.AUTHOR) {
      if (article.authorId !== authenticatedReq.user.id) {
        return NextResponse.json(
          { success: false, data: null, message: 'Forbidden' },
          { status: 403 }
        )
      }
    }

    // Can only submit from DRAFT status
    if (article.status !== ArticleStatus.DRAFT) {
      return NextResponse.json(
        { success: false, data: null, message: 'Article can only be submitted from draft status' },
        { status: 400 }
      )
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.REVIEW },
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        status: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'ARTICLE_SUBMIT_REVIEW',
        targetType: 'ARTICLE',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: 'Article submitted for review successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}
