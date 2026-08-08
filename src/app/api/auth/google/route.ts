import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { credential, code } = body;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '213155484261-pp5npa2jurhqds55lk0oevh8ppbj47f0.apps.googleusercontent.com';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

    if (code) {
      // Server-side OAuth Authorization Code Exchange
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: 'https://healthaibridge.vercel.app/?redirect=%2Fdashboard',
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        return NextResponse.json(
          { success: false, error: tokenData.error_description || 'OAuth code exchange failed' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Server-side Google OAuth authentication verified.',
        tokens: tokenData,
      });
    }

    if (credential) {
      // Server-side ID Token Verification via Google OAuth Certs API
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      const payload = await verifyRes.json();

      if (!verifyRes.ok || payload.aud !== clientId) {
        return NextResponse.json(
          { success: false, error: 'Invalid Google ID Token or mismatched client ID.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Google ID Token verified server-side.',
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          sub: payload.sub,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Missing credential or code parameter.' }, { status: 400 });
  } catch (err: any) {
    console.error('[HealthBridge Google Auth API Error]:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error verifying Google Auth.' }, { status: 500 });
  }
}
