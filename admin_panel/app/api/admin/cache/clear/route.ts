import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'
import { clearCachePattern } from '@/lib/redis'

// POST /api/admin/cache/clear - Clear in-memory cache (SuperAdmin only)
export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    const clearedKeys = await clearCachePattern('*')

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'CACHE_CLEAR',
        targetType: 'SYSTEM',
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: { clearedKeys },
      message: `Cache cleared successfully. ${clearedKeys} keys removed.`,
    })
  } catch (error) {
    return errorHandler(error)
  }
}
