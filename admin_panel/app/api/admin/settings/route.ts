import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// GET /api/admin/settings - Get all settings (SuperAdmin only)
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const settings = await prisma.siteSetting.findMany()

    // Convert to key-value object
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      success: true,
      data: settingsMap,
      message: 'Settings retrieved successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// PATCH /api/admin/settings - Update settings (SuperAdmin only)
export async function PATCH(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const body = await req.json()

    // Update each setting
    const updates = Object.entries(body).map(async ([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    })

    await Promise.all(updates)

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'SETTINGS_UPDATE',
        targetType: 'SETTINGS',
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}
