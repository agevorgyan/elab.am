import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'elab_session_token';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and trying to access /admin/login, redirect to /admin/dashboard
  if (pathname === '/admin/login' && sessionToken) {
    const dashboardUrl = new URL('/admin/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
