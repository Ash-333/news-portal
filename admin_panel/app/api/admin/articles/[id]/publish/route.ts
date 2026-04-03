import { NextRequest, NextResponse } from 'next/server'
import { Role, ArticleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// PATCH /api/admin/articles/:id/publish - Publish article (Admin+)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const { id } = await params

    const article = await prisma.article.update({
      where: { id, deletedAt: null },
      data: { 
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        status: true,
        publishedAt: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'ARTICLE_PUBLISH',
        targetType: 'ARTICLE',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: article,
      message: 'Article published successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}
