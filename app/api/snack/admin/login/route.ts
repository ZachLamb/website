import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const COOKIE_NAME = 'snack_admin';
const MAX_AGE = 60 * 60 * 24; // 24 hours

function getAdminPassword(): string {
  return process.env.SNACK_ADMIN_PASSWORD ?? '';
}

function makeToken(password: string): string {
  const secret = process.env.RESEND_API_KEY ?? 'snack-secret';
  return createHmac('sha256', secret).update(password).digest('hex');
}

export function verifyAdminCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const password = getAdminPassword();
  if (!password) return false;
  return cookieValue === makeToken(password);
}

export async function POST(request: Request) {
  let body: { password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = makeToken(password);
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/snack/admin',
    maxAge: MAX_AGE,
  });

  return res;
}
