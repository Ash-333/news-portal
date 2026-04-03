import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// GET /api/admin/ads/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Advertisement ID is required' }, { status: 400 })
    }
    
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const ad = await prisma.advertisement.findFirst({
      where: { id, deletedAt: null },
      include: { creator: { select: { id: true, name: true } } },
    })

    if (!ad) {
      return NextResponse.json({ success: false, data: null, message: 'Advertisement not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: ad, message: 'Advertisement retrieved successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}

// PATCH /api/admin/ads/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Advertisement ID is required' }, { status: 400 })
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
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.position !== undefined) updateData.position = body.position
    if (body.linkUrl !== undefined) updateData.linkUrl = body.linkUrl
    if (body.mediaUrl !== undefined) updateData.mediaUrl = body.mediaUrl

    const ad = await prisma.advertisement.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: ad, message: 'Advertisement updated successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}

// DELETE /api/admin/ads/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Advertisement ID is required' }, { status: 400 })
    }
    
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    await prisma.advertisement.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true, data: null, message: 'Advertisement deleted successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}
