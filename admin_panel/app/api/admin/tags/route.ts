import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { tagSchema } from '@/lib/validations'
import { authMiddleware, roleMiddleware, validationMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// GET /api/admin/tags - List all tags (Admin+)
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (search) {
      where.OR = [
        { nameNe: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ]
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { nameEn: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: tags,
      message: 'Tags retrieved successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// POST /api/admin/tags - Create tag (Admin+)
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const validation = await validationMiddleware(tagSchema)(req)
    if (validation instanceof NextResponse) return validation

    const tag = await prisma.tag.create({
      data: validation,
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'TAG_CREATE',
        targetType: 'TAG',
        targetId: tag.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag created successfully',
    }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
