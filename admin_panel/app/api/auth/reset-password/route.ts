import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { resetPasswordSchema } from '@/lib/validations'
import { validationMiddleware, errorHandler, checkRateLimitForRequest } from '@/lib/middleware'
import { getCache, deleteCache } from '@/lib/redis'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimitForRequest(req, 'login')
    if (!rateLimit.allowed) {
      return rateLimit.response!
    }

    // Validate request body
    const validation = await validationMiddleware(resetPasswordSchema)(req)
    if (validation instanceof NextResponse) {
      return validation
    }

    const { token, password } = validation

    // Get token data from Redis
    const tokenData = await getCache<{ userId: string }>(`password-reset:${token}`)

    if (!tokenData) {
      return NextResponse.json(
        { success: false, data: null, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Update user password
    await prisma.user.update({
      where: { id: tokenData.userId },
      data: { passwordHash },
    })

    // Delete used token
    await deleteCache(`password-reset:${token}`)

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: tokenData.userId,
        action: 'PASSWORD_RESET',
        targetType: 'USER',
        targetId: tokenData.userId,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        data: null, 
        message: 'Password reset successful. Please sign in with your new password.' 
      },
      { status: 200 }
    )
  } catch (error) {
    return errorHandler(error)
  }
}
