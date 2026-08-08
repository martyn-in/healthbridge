import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

function getValidGoogleClientId(): string {
  const envId = (process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '').replace(/["']/g, '').trim();
  if (envId && envId.endsWith('.apps.googleusercontent.com')) {
    return envId;
  }
  return '213155484261-pp5npa2jurhqds55lk0oevh8ppbj47f0.apps.googleusercontent.com';
}

export async function GET(req: Request) {
  try {
    const clientId = getValidGoogleClientId();
    const rawClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const clientSecret = rawClientSecret.replace(/["']/g, '').trim();

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      (process.env.NODE_ENV === 'production'
        ? 'https://healthaibridge.vercel.app/api/auth/google/callback'
        : 'http://localhost:3000/api/auth/google/callback');

    console.log('[Google OAuth Start] Using verified Client ID:', clientId, 'redirect:', redirectUri);

    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

    // Generate cryptographically secure CSRF state
    const state = crypto.randomBytes(32).toString('hex');

    // Store state in temporary HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('hb_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60, // 10 minutes
    });

    // Generate Google OAuth URL requesting openid, email, profile
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      state,
      prompt: 'select_account',
    });

    return NextResponse.redirect(authorizeUrl);
  } catch (err: any) {
    console.error('[Google OAuth Start Error]:', err);
    return NextResponse.redirect(new URL('/login?error=oauth_init_failed', req.url));
  }
}
