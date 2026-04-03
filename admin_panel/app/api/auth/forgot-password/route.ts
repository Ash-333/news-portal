import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validations'
import { validationMiddleware, errorHandler, checkRateLimitForRequest } from '@/lib/middleware'
import { setCache } from '@/lib/redis'
import { sendEmail, getEmailContent, isEmailConfigured } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - stricter for password reset
    const rateLimit = await checkRateLimitForRequest(req, 'login')
    if (!rateLimit.allowed) {
      return rateLimit.response!
    }

    // Validate request body
    const validation = await validationMiddleware(forgotPasswordSchema)(req)
    if (validation instanceof NextResponse) {
      return validation
    }

    const { email } = validation

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Don't reveal if user exists
    if (!user) {
      return NextResponse.json(
        { 
          success: true, 
          data: null, 
          message: 'If an account exists, a password reset email has been sent.' 
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = 3600 // 1 hour

    // Store token in Redis
    await setCache(`password-reset:${resetToken}`, { userId: user.id }, resetTokenExpiry)

    // Send password reset email
    if (isEmailConfigured()) {
      const { subject, html } = getEmailContent('password-reset', {
        name: user.name,
        token: resetToken,
      })
      
      await sendEmail({
        to: user.email,
        subject,
        html,
      })
    }

    // For development, return the token
    const isDev = process.env.NODE_ENV === 'development'

    return NextResponse.json(
      { 
        success: true, 
        data: isDev ? { resetToken } : null, 
        message: 'If an account exists, a password reset email has been sent.' 
      },
      { status: 200 }
    )
  } catch (error) {
    return errorHandler(error)
  }
}
