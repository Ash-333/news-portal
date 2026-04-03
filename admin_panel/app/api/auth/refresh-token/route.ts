import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimitForRequest, errorHandler } from '@/lib/middleware'
import { refreshAccessToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimitForRequest(req, 'api')
    if (!rateLimit.allowed) {
      return rateLimit.response!
    }

    // Parse request body
    const body = await req.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, data: null, message: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Refresh the access token
    const tokens = refreshAccessToken(refreshToken)

    if (!tokens) {
      return NextResponse.json(
        { success: false, data: null, message: 'Invalid or expired refresh token' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
        },
        message: 'Token refreshed successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    return errorHandler(error)
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    { success: true },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
