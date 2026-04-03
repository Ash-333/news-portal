import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { scheduleArticleSchema } from '@/lib/validations'
import { authMiddleware, roleMiddleware, validationMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// PATCH /api/admin/articles/:id/schedule - Schedule article (Admin+)
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

    const validation = await validationMiddleware(scheduleArticleSchema)(req)
    if (validation instanceof NextResponse) return validation

    const { scheduledAt } = validation

    const article = await prisma.article.update({
      where: { id, deletedAt: null },
      data: { scheduledAt: new Date(scheduledAt) },
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        scheduledAt: true,
        status: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'ARTICLE_SCHEDULE',
        targetType: 'ARTICLE',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: article,
      message: 'Article scheduled successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}
