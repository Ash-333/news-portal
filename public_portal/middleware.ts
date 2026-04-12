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

  // Get language from URL parameter first (for shareable links), then cookie
  const urlLang = request.nextUrl.searchParams.get('lang');
  const cookieLang = request.cookies.get(LANGUAGE_COOKIE)?.value;
  
  let language = urlLang || cookieLang || DEFAULT_LANGUAGE;
  
  // Validate language (only 'ne' or 'en' are valid)
  if (language !== 'ne' && language !== 'en') {
    language = DEFAULT_LANGUAGE;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-language', language);

  // Add security headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Mirror the resolved language on the response for debugging/proxies.
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
