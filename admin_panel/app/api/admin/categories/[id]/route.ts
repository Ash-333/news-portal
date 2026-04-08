import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'
import { authMiddleware, roleMiddleware, validationMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'
import { deleteCachedPattern } from '@/lib/redis'

// PATCH /api/admin/categories/:id - Update category (Admin+)
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

    const validation = await validationMiddleware(categorySchema)(req)
    if (validation instanceof NextResponse) return validation

    const { parentId, ...data } = validation

    // Prevent circular reference
    if (parentId === id) {
      return NextResponse.json(
        { success: false, data: null, message: 'Category cannot be its own parent' },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...data,
        parentId: parentId || null,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'CATEGORY_UPDATE',
        targetType: 'CATEGORY',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    // Invalidate categories cache
    await deleteCachedPattern('categories:')

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// DELETE /api/admin/categories/:id - Delete category (Admin+)
export async function DELETE(
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

    // Check if category has articles
    const articleCount = await prisma.article.count({
      where: { categoryId: id },
    })

    if (articleCount > 0) {
      return NextResponse.json(
        { success: false, data: null, message: `Cannot delete category with ${articleCount} articles` },
        { status: 400 }
      )
    }

    // Move children to root
    await prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    })

    await prisma.category.delete({
      where: { id },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'CATEGORY_DELETE',
        targetType: 'CATEGORY',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    // Invalidate categories cache
    await deleteCachedPattern('categories:')

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}
