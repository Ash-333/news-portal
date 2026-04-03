import { NextRequest, NextResponse } from 'next/server'
import { Role, CommentStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { commentStatusSchema } from '@/lib/validations'
import { authMiddleware, roleMiddleware, validationMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// PATCH /api/admin/comments/:id/status - Update comment status (Admin+)
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

    const validation = await validationMiddleware(commentStatusSchema)(req)
    if (validation instanceof NextResponse) return validation

    const { status } = validation

    const comment = await prisma.comment.update({
      where: { id, deletedAt: null },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true },
        },
        article: {
          select: { id: true, titleNe: true, titleEn: true },
        },
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: `COMMENT_${status}`,
        targetType: 'COMMENT',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: comment,
      message: `Comment ${status.toLowerCase()} successfully`,
    })
  } catch (error) {
    return errorHandler(error)
  }
}
