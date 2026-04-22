import { NextRequest, NextResponse } from 'next/server'
import { Role, ArticleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'
import { z } from 'zod'

const publishArticleSchema = z.object({
  publishedAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:[+-]\d{2}:?\d{2}|Z)?$/,
      "Invalid datetime format. Use format like: YYYY-MM-DDTHH:MM",
    )
    .optional(),
})

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

    // Parse optional publishedAt from body
    let publishedAt = new Date()
    const body = await req.json().catch(() => ({}))
    
    if (body?.publishedAt && body.publishedAt !== "") {
      let dateStr = body.publishedAt
      if (dateStr.split(":").length === 2) {
        dateStr = dateStr + ":00"
      }
      if (!dateStr.endsWith("Z") && !dateStr.includes("+")) {
        const nepalOffset = 5.75 * 60 * 60 * 1000
        const nepalDate = new Date(dateStr)
        publishedAt = new Date(nepalDate.getTime() - nepalOffset)
      } else {
        publishedAt = new Date(dateStr)
      }
    }

    const article = await prisma.article.update({
      where: { id, deletedAt: null },
      data: { 
        status: ArticleStatus.PUBLISHED,
        publishedAt: publishedAt,
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
