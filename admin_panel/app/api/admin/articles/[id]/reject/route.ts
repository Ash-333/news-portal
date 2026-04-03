import { NextRequest, NextResponse } from 'next/server'
import { Role, ArticleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const rejectSchema = z.object({
  reason: z.string().optional(),
})

// PATCH /api/admin/articles/:id/reject - Reject article (Admin+)
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
    const body = await req.json()
    const { reason } = rejectSchema.parse(body)

    // Revert to draft status
    const article = await prisma.article.update({
      where: { id, deletedAt: null },
      data: { status: ArticleStatus.DRAFT },
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
        action: 'ARTICLE_REJECT',
        targetType: 'ARTICLE',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    // Note: Article rejection notification email can be implemented when needed

    return NextResponse.json({
      success: true,
      data: article,
      message: reason ? `Article rejected: ${reason}` : 'Article rejected successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}
