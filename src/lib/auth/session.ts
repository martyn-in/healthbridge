import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export interface SessionUser {
  id: string;
  googleSub: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
}

const SESSION_COOKIE_NAME = 'hb_session_token';
const SESSION_SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'healthbridge_secure_session_secret_key_2026_prod'
);

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

/**
 * Signs a secure HTTP-only session token payload using JOSE JWT HMAC SHA-256
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    googleSub: user.googleSub,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SESSION_SECRET_KEY);
}

/**
 * Verifies and decodes the HTTP-only session token
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET_KEY);
    return {
      id: payload.id as string,
      googleSub: payload.googleSub as string,
      email: payload.email as string,
      name: payload.name as string,
      avatarUrl: payload.avatarUrl as string,
      role: (payload.role as 'patient' | 'doctor' | 'admin') || 'patient',
      createdAt: (payload.createdAt as string) || new Date().toISOString(),
    };
  } catch (err) {
    return null;
  }
}

/**
 * Sets the HTTP-only session cookie in the Next.js response headers
 */
export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SEVEN_DAYS_SECONDS,
  });
}

/**
 * Gets the current authenticated session user from HTTP-only cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    return await verifySessionToken(token);
  } catch (err) {
    return null;
  }
}

/**
 * Deletes the session cookie (Logout)
 */
export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
