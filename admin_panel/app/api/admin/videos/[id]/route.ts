import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// GET /api/admin/videos/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Video ID is required' }, { status: 400 })
    }
    
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const video = await prisma.video.findFirst({
      where: { id, deletedAt: null },
      include: { author: { select: { id: true, name: true } } },
    })

    if (!video) {
      return NextResponse.json({ success: false, data: null, message: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: video, message: 'Video retrieved successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}

// PATCH /api/admin/videos/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Video ID is required' }, { status: 400 })
    }
    
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const body = await req.json()
    const updateData: Record<string, unknown> = {}

    if (body.titleNe !== undefined) updateData.titleNe = body.titleNe
    if (body.titleEn !== undefined) updateData.titleEn = body.titleEn
    if (body.isPublished !== undefined) {
      updateData.isPublished = body.isPublished
      if (body.isPublished) updateData.publishedAt = new Date()
    }

    const video = await prisma.video.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: video, message: 'Video updated successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}

// DELETE /api/admin/videos/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Video ID is required' }, { status: 400 })
    }
    
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    await prisma.video.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'VIDEO_DELETE',
        targetType: 'VIDEO',
        targetId: id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({ success: true, data: null, message: 'Video deleted successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}
