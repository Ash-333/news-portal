import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Handle preflight requests for API
    if (req.method === 'OPTIONS' && pathname.startsWith('/api/')) {
      const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN?.trim() || 'http://localhost:3001'
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept, Accept-Version, Content-MD5, Date, X-Api-Version',
          'Access-Control-Allow-Credentials': 'true',
        }
      })
    }

    // Protect admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      // Check if user has appropriate role
      const allowedRoles = ['ADMIN', 'SUPERADMIN', 'AUTHOR']
      if (!token?.role || !allowedRoles.includes(token.role as string)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden: Insufficient permissions' },
          { status: 403 }
        )
      }
    }

    // Protect SuperAdmin-only routes
    if (
      pathname.startsWith('/admin/audit-logs') ||
      pathname.startsWith('/admin/settings') ||
      pathname.startsWith('/admin/users/roles') ||
      pathname.startsWith('/api/admin/audit-logs') ||
      pathname.startsWith('/api/admin/settings') ||
      pathname.startsWith('/api/admin/cache')
    ) {
      if (token?.role !== 'SUPERADMIN') {
        return NextResponse.json(
          { success: false, message: 'Forbidden: SuperAdmin access required' },
          { status: 403 }
        )
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow public routes and OPTIONS
        if (req.method === 'OPTIONS' || (!req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/api/admin'))) {
          return true
        }
        // Require token for admin routes
        return token !== null
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}
