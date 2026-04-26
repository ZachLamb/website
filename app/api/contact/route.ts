import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit } from '@/lib/rate-limit';

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(key);
}

// Where the contact form delivers to (backend-only, never shown to visitors).
// Defaults to the personal inbox so a misconfigured CONTACT_EMAIL doesn't
// silently route mail through a forwarding chain. Visitors see
// NEXT_PUBLIC_CONTACT_EMAIL in the mailto link instead.
const TO_EMAIL = process.env.CONTACT_EMAIL ?? 'zachlamb94@gmail.com';
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;
const MAX_MESSAGE_LENGTH = 5000;

const ALLOWED_ORIGINS = new Set<string>([
  'https://zachlamb.io',
  'https://www.zachlamb.io',
  'http://localhost:3000',
  'http://localhost',
]);

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'https:') return false;
    // Vercel preview deploys for this project
    if (hostname.endsWith('.vercel.app') && hostname.includes('zachlamb')) return true;
  } catch {
    return false;
  }
  return false;
}

function getClientId(request: Request): string {
  // Prefer Vercel-signed header: clients can't forge it because Vercel's edge rewrites it.
  // Fall back to x-forwarded-for (first hop) for non-Vercel environments, then x-real-ip.
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) return vercelIp.split(',')[0].trim();
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

// Strip CR/LF so a malicious name can't inject mail headers via the subject line.
function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ');
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!isOriginAllowed(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { name?: string; email?: string; message?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json({ error: 'Input exceeds maximum length' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const { allowed } = await rateLimit(getClientId(request), {
    windowMs: 15 * 60 * 1000,
    max: 5,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 },
    );
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail && process.env.NODE_ENV === 'production') {
    // Fail closed in production: refuse to send via Resend's shared sandbox domain
    // (onboarding@resend.dev), which would fail SPF/DMARC and land mail in spam.
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 });
  }

  try {
    const { error } = await getResendClient().emails.send({
      from: `Portfolio Contact <${fromEmail ?? 'onboarding@resend.dev'}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: sanitizeHeader(`Portfolio message from ${name}`),
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
