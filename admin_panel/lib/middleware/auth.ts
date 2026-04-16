import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role, UserStatus } from '@prisma/client'
import { prisma } from '../prisma'
import { verifyToken } from '../jwt'

interface CacheEntry {
  user: { id: string; email: string; name: string; role: Role }
  expires: number
}

const userCache = new Map<string, CacheEntry>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCachedUser(userId: string): CacheEntry | undefined {
  const entry = userCache.get(userId)
  if (entry && entry.expires > Date.now()) {
    return entry
  }
  userCache.delete(userId)
  return undefined
}

function setCachedUser(userId: string, user: CacheEntry['user']): void {
  userCache.set(userId, { user, expires: Date.now() + CACHE_TTL })
}

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name: string
    role: Role
  }
}

export async function authMiddleware(
  req: NextRequest
): Promise<NextResponse | AuthenticatedRequest> {
  try {
    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null

    const verifiedBearerToken = bearerToken ? verifyToken(bearerToken) : null
    const nextAuthToken = verifiedBearerToken
      ? null
      : await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET
        })

    const tokenUserId =
      verifiedBearerToken?.id ||
      (typeof nextAuthToken?.sub === 'string' ? nextAuthToken.sub : null) ||
      (typeof nextAuthToken?.id === 'string' ? nextAuthToken.id : null)

    if (!tokenUserId) {
      return NextResponse.json(
        { success: false, data: null, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Always verify user exists in database for accuracy
    // Cache temporarily disabled for testing
    const user = await prisma.user.findUnique({
      where: { id: tokenUserId },
      select: { id: true, email: true, name: true, role: true, status: true }
    })

    if (!user || user.status !== UserStatus.ACTIVE) {
      return NextResponse.json(
        { success: false, data: null, message: 'User not found or account inactive' },
        { status: 401 }
      )
    }

    // Set user on request
    const authenticatedReq = req as AuthenticatedRequest
    authenticatedReq.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }

    return authenticatedReq
  } catch (error) {
    return NextResponse.json(
      { success: false, data: null, message: 'Authentication error' },
      { status: 401 }
    )
  }
}

export function roleMiddleware(allowedRoles: Role[]) {
  return async (
    req: AuthenticatedRequest
  ): Promise<NextResponse | AuthenticatedRequest> => {
    if (!req.user) {
      return NextResponse.json(
        { success: false, data: null, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // SuperAdmin always passes
    if (req.user.role === Role.SUPERADMIN) {
      return req
    }

    if (!allowedRoles.includes(req.user.role)) {
      return NextResponse.json(
        { success: false, data: null, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    }

    return req
  }
}
