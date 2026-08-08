import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'hb_session_token';
const SESSION_SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'healthbridge_secure_session_secret_key_2026_prod'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard, /doctor, and /admin routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/doctor') || pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const isDoctorRoute = pathname.startsWith('/doctor');
      const isAdminRoute = pathname.startsWith('/admin');
      
      let loginUrl;
      if (isAdminRoute) loginUrl = new URL('/login/admin', request.url);
      else if (isDoctorRoute) loginUrl = new URL('/login/doctor', request.url);
      else loginUrl = new URL('/login/patient', request.url);
      
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

      // Role check for Admin routes
      if (pathname.startsWith('/admin')) {
        if (role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Role check for Doctor routes
      if (pathname.startsWith('/doctor')) {
        if (role !== 'doctor') {
          // If a patient or admin tries to access doctor portal, kick them back
          return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url));
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
          return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/doctor', request.url));
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
