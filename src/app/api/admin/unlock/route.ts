import { NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/auth/admin-session';

// Simple in-memory brute force protection.
// In a highly distributed edge environment this might reset, 
// but it's sufficient for basic protection as requested.
const attempts = new Map<string, { count: number, lockUntil: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const record = attempts.get(ip);
    
    if (record && record.lockUntil > Date.now()) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { code } = await req.json();
    const expectedCode = process.env.ADMIN_ACCESS_CODE;

    if (!expectedCode) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_CODE NOT CONFIGURED' },
        { status: 500 }
      );
    }

    if (code !== expectedCode) {
      const newCount = (record?.count || 0) + 1;
      const lockUntil = newCount >= 5 ? Date.now() + 15 * 60 * 1000 : 0; // 15 mins lock after 5 attempts
      
      attempts.set(ip, { count: newCount, lockUntil });

      return NextResponse.json(
        { success: false, error: 'Invalid access code' },
        { status: 401 }
      );
    }

    // Success - reset attempts
    attempts.delete(ip);

    // Create HttpOnly Admin session
    await createAdminSession();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Admin unlock error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
