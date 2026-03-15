import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not configured');
  return new Resend(key);
}

const TO_EMAIL = process.env.CONTACT_EMAIL ?? 'hello@zachlamb.com';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientId(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  if (!entry) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (now >= entry.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= RATE_LIMIT_MAX;
}

const REQUIRED_FIELDS = [
  'name',
  'age',
  'location',
  'pitch',
  'loveLanguage',
  'oreoPreference',
  'dogOpinion',
  'idealDate',
  'bigSpoon',
] as const;

export async function POST(request: Request) {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field]?.toString().trim()) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  if (body.name.length > 100 || body.location.length > 200 || body.pitch.length > 2000) {
    return NextResponse.json({ error: 'Input exceeds maximum length' }, { status: 400 });
  }

  const age = parseInt(body.age, 10);
  if (isNaN(age) || age < 18 || age > 120) {
    return NextResponse.json({ error: 'Invalid age' }, { status: 400 });
  }

  const clientId = getClientId(request);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 },
    );
  }

  const submission = {
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: body.name.trim(),
    age,
    location: body.location.trim(),
    instagram: (body.instagram ?? '').trim(),
    pitch: body.pitch.trim(),
    loveLanguage: body.loveLanguage,
    oreoPreference: body.oreoPreference,
    dogOpinion: body.dogOpinion,
    idealDate: body.idealDate,
    bigSpoon: body.bigSpoon,
    submittedAt: new Date().toISOString(),
  };

  try {
    await kv.lpush('snack:applications', JSON.stringify(submission));
  } catch (err) {
    console.error('KV storage error:', err);
    // Continue to send email even if KV fails
  }

  try {
    const lines = [
      `New Friend Request from ${submission.name}`,
      `Age: ${submission.age}`,
      `Location: ${submission.location}`,
      submission.instagram ? `Instagram: ${submission.instagram}` : null,
      '',
      `Why should Snack pick them:`,
      submission.pitch,
      '',
      `Love Language: ${submission.loveLanguage}`,
      `Oreo Preference: ${submission.oreoPreference}`,
      `Dog Opinion: ${submission.dogOpinion}`,
      `Ideal Date: ${submission.idealDate}`,
      `Spoon: ${submission.bigSpoon}`,
    ]
      .filter((l) => l !== null)
      .join('\n');

    await getResendClient().emails.send({
      from: `Snack's MySpace <${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'}>`,
      to: TO_EMAIL,
      subject: `New Friend Request: ${submission.name}`,
      text: lines,
    });
  } catch (err) {
    console.error('Email error:', err);
  }

  return NextResponse.json({ success: true });
}
