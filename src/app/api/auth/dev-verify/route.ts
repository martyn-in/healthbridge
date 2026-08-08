import { NextResponse } from 'next/server';
import { getSession, setSessionCookie } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the session to verified
    const verifiedSession = {
      ...session,
      doctorVerified: true,
    };

    await setSessionCookie(verifiedSession);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Dev Verify Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
