import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Database-driven redirects (in production, fetch from database)
const redirects: Record<string, string> = {
  '/old-article': '/article/new-article',
  '/politics-old': '/category/politics',
};

// Cookie name for language preference
const LANGUAGE_COOKIE = 'language';
const DEFAULT_LANGUAGE = 'ne';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for redirects
  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url), 301);
  }

  // Get language from cookie or use default
  let language = request.cookies.get(LANGUAGE_COOKIE)?.value || DEFAULT_LANGUAGE;
  
  // Validate language (only 'ne' or 'en' are valid)
  if (language !== 'ne' && language !== 'en') {
    language = DEFAULT_LANGUAGE;
  }

  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Pass language to server components via header
  response.headers.set('x-language', language);
  
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
