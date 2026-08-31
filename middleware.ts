import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'elab_session_token';

// Public Admin Authentication Routes (Rule #5)
const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Pass current pathname to downstream Server Components via request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  const isPublicAdminRoute = PUBLIC_ADMIN_PATHS.includes(pathname);

  // Public admin routes -> Allow rendering (Server Components perform DB session verification)
  if (isPublicAdminRoute) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // CASE 3, 4: Protected /admin/* routes requested by unauthenticated users -> Redirect to login with redirect param
  if (pathname.startsWith('/admin')) {
    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
