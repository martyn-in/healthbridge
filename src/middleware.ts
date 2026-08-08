import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'hb_session_token';
const SESSION_SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'healthbridge_secure_session_secret_key_2026_prod'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and all subroutes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SESSION_SECRET_KEY);
      
      if (!payload || !payload.id) {
        throw new Error('Invalid payload');
      }

      // Check role authorization for doctor workspace
      if (pathname.startsWith('/dashboard/doctor')) {
        const role = payload.role as string;
        if (role !== 'doctor' && role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      return NextResponse.next();
    } catch (err) {
      // Failed token verification -> Clear invalid cookie & redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
