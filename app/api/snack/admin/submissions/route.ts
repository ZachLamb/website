import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { verifyAdminCookie } from '../login/route';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('snack_admin')?.value;
  if (!verifyAdminCookie(cookie)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const raw = await kv.lrange('snack:applications', 0, -1);
    const submissions = raw.map((item) => {
      if (typeof item === 'string') return JSON.parse(item);
      return item;
    });
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('KV read error:', err);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
