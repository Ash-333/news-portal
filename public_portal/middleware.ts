import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Database-driven redirects (in production, fetch from database)
const redirects: Record<string, string> = {
  '/old-article': '/article/new-article',
  '/politics-old': '/category/politics',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for redirects
  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url), 301);
  }

  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
