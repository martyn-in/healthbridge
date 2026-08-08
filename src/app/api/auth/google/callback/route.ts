import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';
import { setSessionCookie, SessionUser } from '@/lib/auth/session';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error || !code || !state) {
    console.warn('[Google OAuth Callback Error]: User cancelled or missing code/state', error);
    return NextResponse.redirect(new URL('/login?error=google_auth_cancelled', req.url));
  }

  try {
    const cookieStore = await cookies();
    const storedState = cookieStore.get('hb_oauth_state')?.value;

    // 1. CSRF State Validation
    if (!storedState || storedState !== state) {
      console.error('[Google OAuth State Mismatch]: Possible CSRF attack detected');
      return NextResponse.redirect(new URL('/login?error=state_mismatch', req.url));
    }

    // Clear state cookie
    cookieStore.set('hb_oauth_state', '', { maxAge: 0, path: '/' });

    const rawClientId =
      process.env.GOOGLE_CLIENT_ID ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      '213155484261-pp5npa2jurhqds55lk0oevh8ppbj47f0.apps.googleusercontent.com';
    const clientId = rawClientId.replace(/["']/g, '').trim();

    const rawClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const clientSecret = rawClientSecret.replace(/["']/g, '').trim();

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      (process.env.NODE_ENV === 'production'
        ? 'https://healthaibridge.vercel.app/api/auth/google/callback'
        : 'http://localhost:3000/api/auth/google/callback');

    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

    // 2. Server-side Authorization Code Exchange using google-auth-library
    const { tokens } = await oauth2Client.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error('Google OAuth server failed to return ID Token');
    }

    // 3. Official ID Token Signature & Audience Verification
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      throw new Error('Invalid Google ID Token payload');
    }

    // Verify Issuer
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!payload.iss || !validIssuers.includes(payload.iss)) {
      throw new Error('Untrusted Google ID Token issuer');
    }

    // 4. Extract verified canonical Google User Identity
    const googleSub = payload.sub;
    const email = payload.email;
    const name = payload.name || payload.email.split('@')[0] || 'Patient User';
    const avatarUrl = payload.picture || '';

    // Create or retrieve verified HealthBridge user session object
    const sessionUser: SessionUser = {
      id: `hb_user_${googleSub.slice(-8)}`,
      googleSub,
      email,
      name,
      avatarUrl,
      role: 'patient', // Server-assigned safe default role
      createdAt: new Date().toISOString(),
    };

    // 5. Set Secure HTTP-Only Session Cookie
    await setSessionCookie(sessionUser);

    // 6. Redirect to Dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (err: any) {
    console.error('[Google OAuth Callback Exception]:', err);
    return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
  }
}
