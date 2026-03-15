import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'myspace_admin';
const MAX_AGE = 60 * 60 * 24; // 24 hours
const LOGIN_WINDOW_SECONDS = 15 * 60; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60; // 15 minutes

function getAdminPassword(): string {
  return process.env.MYSPACE_ADMIN_PASSWORD ?? '';
}

function makeToken(password: string): string {
  const secret = process.env.RESEND_API_KEY ?? 'myspace-secret';
  return createHmac('sha256', secret).update(password).digest('hex');
}

function getRequesterId(request: Request): string {
  return (
    request.headers.get('x-vercel-ip-hash')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function getLoginKeys(requesterId: string) {
  const scoped = `myspace:admin:login:${requesterId}`;
  return {
    attemptsKey: `${scoped}:attempts`,
    lockKey: `${scoped}:lock`,
  };
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

async function isLockedOut(requesterId: string): Promise<boolean> {
  const { lockKey } = getLoginKeys(requesterId);
  return Boolean(await kv.get(lockKey));
}

async function registerFailedAttempt(requesterId: string): Promise<boolean> {
  const { attemptsKey, lockKey } = getLoginKeys(requesterId);
  const attempts = await kv.incr(attemptsKey);
  if (attempts === 1) {
    await kv.expire(attemptsKey, LOGIN_WINDOW_SECONDS);
  }
  if (attempts >= LOGIN_MAX_ATTEMPTS) {
    await kv.set(lockKey, '1', { ex: LOCKOUT_SECONDS });
    await kv.del(attemptsKey);
    return true;
  }
  return false;
}

async function clearLoginThrottle(requesterId: string): Promise<void> {
  const { attemptsKey, lockKey } = getLoginKeys(requesterId);
  await kv.del(attemptsKey, lockKey);
}

export function verifyAdminCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const password = getAdminPassword();
  if (!password) return false;
  return safeEqual(cookieValue, makeToken(password));
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

  const requesterId = getRequesterId(request);
  if (await isLockedOut(requesterId)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 },
    );
  }

  if (!safeEqual(password, adminPassword)) {
    const nowLockedOut = await registerFailedAttempt(requesterId);
    if (nowLockedOut) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = makeToken(password);
  await clearLoginThrottle(requesterId);
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/myspace/admin',
    maxAge: MAX_AGE,
  });

  return res;
}
