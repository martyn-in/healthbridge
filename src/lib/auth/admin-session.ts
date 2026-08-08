import { cookies } from 'next/headers';
import * as jose from 'jose';

const ADMIN_SESSION_COOKIE = 'healthbridge_admin_session';

// We use a simple JWT just to ensure the cookie hasn't been tampered with
// by signing it with a secret key.
const secretKey = new TextEncoder().encode(
  process.env.CONVEX_ADMIN_SECRET || 'fallback-secret-for-development'
);

export async function createAdminSession() {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes
  
  const token = await new jose.SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });
}

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) return false;

  try {
    await jose.jwtVerify(token, secretKey);
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
