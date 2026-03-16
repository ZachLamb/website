import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { auth } from '@/auth';

export async function GET() {
  const allowedEmail = process.env.MYSPACE_ADMIN_USERNAME ?? '';
  const session = await auth();
  if (!session?.user?.email || session.user.email !== allowedEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const raw = await kv.lrange('myspace:applications', 0, -1);
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
