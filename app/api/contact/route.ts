import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import * as Sentry from '@sentry/nextjs';
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

const ALLOWED_ORIGINS = new Set<string>(['https://zachlamb.io', 'https://www.zachlamb.io']);

// Only trusted outside production, so a prod deploy never accepts a plaintext
// localhost Origin as a same-site request.
const DEV_ALLOWED_ORIGINS = new Set<string>(['http://localhost:3000', 'http://localhost']);

/**
 * Origins for the current Vercel deployment, derived from the server-only env
 * vars Vercel injects at runtime (no NEXT_PUBLIC_ prefix, so they never reach
 * the client bundle).
 *
 * This replaces a substring heuristic (`hostname.endsWith('.vercel.app') &&
 * hostname.includes('zachlamb')`) that any third party could satisfy: Vercel
 * project names are globally claimable, so deploying a project named
 * `zachlamb-anything` yields `zachlamb-anything.vercel.app` and passed the old
 * check — defeating the CSRF origin gate. Exact matching against the values
 * Vercel gives us keeps preview deploys working with no wildcard to abuse.
 */
function getVercelOrigins(): string[] {
  return [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_URL,
  ]
    .filter((host): host is string => typeof host === 'string' && host.trim() !== '')
    .map((host) => `https://${host.trim()}`);
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (process.env.NODE_ENV !== 'production' && DEV_ALLOWED_ORIGINS.has(origin)) return true;
  return getVercelOrigins().includes(origin);
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Parse, don't validate: everything past this point is a known-good string.
  // The body is attacker-controlled JSON, so each field must be type-checked
  // before any string method touches it — `name.trim()` on a number, array, or
  // object throws a TypeError that would escape the handler as an opaque 500.
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name: rawName, email: rawEmail, message: rawMessage } = body as Record<string, unknown>;

  if (
    typeof rawName !== 'string' ||
    typeof rawEmail !== 'string' ||
    typeof rawMessage !== 'string'
  ) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  const name = rawName.trim();
  const email = rawEmail.trim();
  const message = rawMessage.trim();

  if (!name || !email || !message) {
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
      // Resend returned a structured error (invalid API key, rate limited,
      // domain not verified, etc.). Wrap in an Error so Sentry captures the
      // message + stack. Pass NO PII — never include the request body, name,
      // email, or message in the captured event.
      Sentry.captureException(new Error(`Resend send failed: ${error.message ?? 'unknown'}`), {
        tags: { route: 'contact', source: 'resend', kind: 'response-error' },
      });
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // Network failure, thrown error from the SDK, etc. Capture without PII.
    Sentry.captureException(err, {
      tags: { route: 'contact', source: 'resend', kind: 'thrown' },
    });
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
