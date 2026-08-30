import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'elab_session_token';

// Unprotected public admin routes
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/forgot-password'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Protect all /admin/* routes except public admin paths
  if (pathname.startsWith('/admin') && !PUBLIC_ADMIN_PATHS.includes(pathname)) {
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent authenticated users from returning to login / forgot-password
  if (PUBLIC_ADMIN_PATHS.includes(pathname) && sessionToken) {
    const dashboardUrl = new URL('/admin/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
