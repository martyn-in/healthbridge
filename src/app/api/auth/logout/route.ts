import { NextResponse } from 'next/server';
import { deleteSessionCookie } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    await deleteSessionCookie();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to clear session.' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await deleteSessionCookie();
  return NextResponse.redirect(new URL('/login', req.url));
}
