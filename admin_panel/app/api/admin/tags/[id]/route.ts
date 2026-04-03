import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { tagSchema } from '@/lib/validations'
import { authMiddleware, roleMiddleware, validationMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// PATCH /api/admin/tags/:id - Update tag (Admin+)
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

    const validation = await validationMiddleware(tagSchema)(req)
    if (validation instanceof NextResponse) return validation

    const tag = await prisma.tag.update({
      where: { id },
      data: validation,
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'TAG_UPDATE',
        targetType: 'TAG',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag updated successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// DELETE /api/admin/tags/:id - Delete tag (Admin+)
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

    await prisma.tag.delete({
      where: { id },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'TAG_DELETE',
        targetType: 'TAG',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Tag deleted successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}
