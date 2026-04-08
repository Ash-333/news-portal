import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'
import { authMiddleware, roleMiddleware, validationMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'
import { deleteCachedPattern } from '@/lib/redis'

// GET /api/admin/categories - List all categories (Author+)
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const categories = await prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        children: true,
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { nameEn: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// POST /api/admin/categories - Create category (Admin+)
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const validation = await validationMiddleware(categorySchema)(req)
    if (validation instanceof NextResponse) return validation

    const { parentId, ...data } = validation

    const category = await prisma.category.create({
      data: {
        ...data,
        parentId: parentId || null,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'CATEGORY_CREATE',
        targetType: 'CATEGORY',
        targetId: category.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    // Invalidate categories cache
    await deleteCachedPattern('categories:')

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully',
    }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}
