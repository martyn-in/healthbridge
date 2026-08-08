import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'hb_session_token';
const SESSION_SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'healthbridge_secure_session_secret_key_2026_prod'
);

const ADMIN_SESSION_COOKIE = 'healthbridge_admin_session';
const ADMIN_SECRET_KEY = new TextEncoder().encode(
  process.env.CONVEX_ADMIN_SECRET || 'fallback-secret-for-development'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/?admin=true', request.url));
    }
    try {
      await jwtVerify(adminToken, ADMIN_SECRET_KEY);
      return NextResponse.next();
    } catch (e) {
      const response = NextResponse.redirect(new URL('/?admin=true', request.url));
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }
  }

  // Protect /dashboard and /doctor routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/doctor')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const isDoctorRoute = pathname.startsWith('/doctor');
      const loginUrl = new URL(isDoctorRoute ? '/login/doctor' : '/login/patient', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SESSION_SECRET_KEY);
      
      if (!payload || !payload.id) {
        throw new Error('Invalid payload');
      }

      const role = payload.role as string;
      const doctorVerified = payload.doctorVerified as boolean | undefined;
      const accountStatus = payload.accountStatus as string | undefined;

      if (accountStatus === 'suspended') {
        throw new Error('Account suspended');
      }

      // Role check for Doctor routes
      if (pathname.startsWith('/doctor')) {
        if (role !== 'doctor') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // If they are a doctor but NOT verified, restrict to /doctor/verification
        if (!doctorVerified && pathname !== '/doctor/verification') {
          return NextResponse.redirect(new URL('/doctor/verification', request.url));
        }

        // If they are verified and try to access verification page, send to dashboard
        if (doctorVerified && pathname === '/doctor/verification') {
          return NextResponse.redirect(new URL('/doctor', request.url));
        }
      }

      // Role check for Patient routes
      if (pathname.startsWith('/dashboard')) {
        if (role !== 'patient') {
          return NextResponse.redirect(new URL('/doctor', request.url));
        }
      }

      return NextResponse.next();
    } catch (err) {
      // Failed token verification -> Clear invalid cookie & redirect to login
      const isDoctorRoute = pathname.startsWith('/doctor');
      const loginUrl = new URL(isDoctorRoute ? '/login/doctor' : '/login/patient', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(SESSION_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/doctor/:path*', '/admin/:path*'],
};
