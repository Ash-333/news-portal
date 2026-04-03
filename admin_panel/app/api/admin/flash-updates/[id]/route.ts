import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// GET /api/admin/flash-updates/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Flash update ID is required' }, { status: 400 })
    }
    
    const update = await prisma.flashUpdate.findFirst({
      where: { id, deletedAt: null },
      include: {
        author: { select: { id: true, name: true, profilePhoto: true } },
        featuredImage: { select: { id: true, url: true, filename: true } },
      },
    })

    if (!update) {
      return NextResponse.json({ success: false, data: null, message: 'Flash update not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: update, message: 'Flash update retrieved successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}

// PATCH /api/admin/flash-updates/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const body = await req.json()
    const updateData: Record<string, unknown> = {}

    const fields = ['titleNe', 'titleEn', 'contentNe', 'contentEn', 'excerptNe', 'excerptEn', 'metaTitle', 'metaDescription', 'ogImage', 'featuredImageId']
    for (const field of fields) {
      if (body[field] !== undefined) updateData[field] = body[field]
    }
    if (body.isPublished !== undefined) {
      updateData.isPublished = body.isPublished
      if (body.isPublished && !body.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Flash update ID is required' }, { status: 400 })
    }
    
    const update = await prisma.flashUpdate.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: update, message: 'Flash update updated successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}

// DELETE /api/admin/flash-updates/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ success: false, data: null, message: 'Flash update ID is required' }, { status: 400 })
    }
    
    await prisma.flashUpdate.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true, data: null, message: 'Flash update deleted successfully' })
  } catch (error) {
    return errorHandler(error)
  }
}
