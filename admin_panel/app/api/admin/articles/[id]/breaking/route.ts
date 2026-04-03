import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const breakingSchema = z.object({
  isBreaking: z.boolean(),
})

// PATCH /api/admin/articles/:id/breaking - Toggle breaking news (Admin+)
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
    const { isBreaking } = breakingSchema.parse(body)

    const article = await prisma.article.update({
      where: { id, deletedAt: null },
      data: { isBreaking },
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        isBreaking: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: isBreaking ? 'ARTICLE_SET_BREAKING' : 'ARTICLE_UNSET_BREAKING',
        targetType: 'ARTICLE',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: article,
      message: `Breaking news ${isBreaking ? 'enabled' : 'disabled'} successfully`,
    })
  } catch (error) {
    return errorHandler(error)
  }
}
