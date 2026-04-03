import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Role, UserStatus } from '@prisma/client'
import { prisma } from '../prisma'

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
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      return NextResponse.json(
        { success: false, data: null, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user exists in database to prevent stale session issues
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: { id: true, email: true, name: true, role: true, status: true }
    })

    if (!user || user.status !== UserStatus.ACTIVE) {
      return NextResponse.json(
        { success: false, data: null, message: 'User not found or account inactive' },
        { status: 401 }
      )
    }

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
