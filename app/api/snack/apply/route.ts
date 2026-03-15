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
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const RATE_LIMIT_MAX = 3;

function getClientId(request: Request): string {
  return (
    request.headers.get('x-vercel-ip-hash')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

async function checkRateLimit(clientId: string): Promise<boolean> {
  const windowBucket = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS);
  const key = `myspace:apply:ratelimit:${clientId}:${windowBucket}`;
  try {
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, RATE_LIMIT_WINDOW_SECONDS + 5);
    }
    return count <= RATE_LIMIT_MAX;
  } catch (err) {
    // If KV is unavailable, allow the request instead of hard-failing submissions.
    console.error('KV rate limit error:', err);
    return true;
  }
}

export async function POST(request: Request) {
  let body: Record<string, string | number | undefined>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = body.name?.toString().trim() ?? '';
  const ageRaw = body.age?.toString() ?? '';
  const location = body.location?.toString().trim() ?? '';
  const instagram = body.instagram?.toString().trim() ?? '';
  const pitch = body.pitch?.toString().trim() ?? '';
  const loveLanguage = body.loveLanguage?.toString().trim() ?? '';
  const oreoPreference = body.oreoPreference?.toString().trim() ?? '';
  const petOpinion = (body.petOpinion ?? body.dogOpinion)?.toString().trim() ?? '';
  const idealDate = body.idealDate?.toString().trim() ?? '';
  const travelStyle = body.travelStyle?.toString().trim() ?? '';
  const bigSpoon = body.bigSpoon?.toString().trim() ?? '';

  const requiredFields = [
    ['name', name],
    ['age', ageRaw],
    ['location', location],
    ['pitch', pitch],
    ['loveLanguage', loveLanguage],
    ['oreoPreference', oreoPreference],
    ['petOpinion', petOpinion],
    ['idealDate', idealDate],
    ['travelStyle', travelStyle],
    ['bigSpoon', bigSpoon],
  ] as const;

  for (const [field, value] of requiredFields) {
    if (!value) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  if (name.length > 100 || location.length > 200 || pitch.length > 2000) {
    return NextResponse.json({ error: 'Input exceeds maximum length' }, { status: 400 });
  }

  const age = parseInt(ageRaw, 10);
  if (isNaN(age) || age < 18 || age > 120) {
    return NextResponse.json({ error: 'Invalid age' }, { status: 400 });
  }

  const clientId = getClientId(request);
  if (!(await checkRateLimit(clientId))) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 },
    );
  }

  const submission = {
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    age,
    location,
    instagram,
    pitch,
    loveLanguage,
    oreoPreference,
    petOpinion,
    idealDate,
    travelStyle,
    bigSpoon,
    submittedAt: new Date().toISOString(),
  };

  try {
    await kv.lpush('myspace:applications', JSON.stringify(submission));
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
      `Pet Opinion: ${submission.petOpinion}`,
      `Ideal Date: ${submission.idealDate}`,
      `Travel Style: ${submission.travelStyle}`,
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
