// @vitest-environment node
// Node's native Request preserves the Origin header; happy-dom strips it per the
// Fetch spec's forbidden-request-header rule, so we run this file in `node`.

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.stubEnv('RESEND_API_KEY', 'test_key');

import { POST } from './route';

function makeRequest(body: Record<string, unknown>, headers?: HeadersInit) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
      ...headers,
    } as HeadersInit,
    body: JSON.stringify(body),
  });
}

// Unique IPs per test avoid cross-test rate-limit interference (the route's
// in-memory Map persists across tests in this module).
let testIpCounter = 10;
function nextTestIp(): string {
  testIpCounter += 1;
  return `10.0.0.${testIpCounter}`;
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMock.mockClear();
  });

  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', message: 'hi' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/required/i);
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ name: 'Frodo', message: 'hi' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/required/i);
  });

  it('returns 400 when message is missing', async () => {
    const res = await POST(makeRequest({ name: 'Frodo', email: 'a@b.com' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/required/i);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await POST(makeRequest({ name: 'Frodo', email: 'not-an-email', message: 'hi' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/email/i);
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
      body: 'not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 on valid input', async () => {
    const res = await POST(
      makeRequest({ name: 'Frodo', email: 'frodo@shire.me', message: 'Hello!' }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('returns 400 when fields are only whitespace', async () => {
    const res = await POST(makeRequest({ name: '  ', email: 'a@b.com', message: 'hi' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when input exceeds max length', async () => {
    const res = await POST(
      makeRequest({ name: 'Frodo', email: 'a@b.com', message: 'x'.repeat(6000) }),
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/length/i);
  });

  it('returns 500 when Resend returns an error object', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'API key invalid' } });
    const res = await POST(
      makeRequest({ name: 'Frodo', email: 'frodo@shire.me', message: 'Hello!' }),
    );
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/failed/i);
  });

  it('returns 500 when Resend throws', async () => {
    sendMock.mockRejectedValueOnce(new Error('Network error'));
    const res = await POST(
      makeRequest({ name: 'Frodo', email: 'frodo@shire.me', message: 'Hello!' }),
    );
    expect(res.status).toBe(500);
  });

  it('returns 429 when rate limit exceeded', async () => {
    const clientHeader = { 'x-forwarded-for': '192.168.1.100' };
    const validBody = { name: 'Frodo', email: 'frodo@shire.me', message: 'Hello!' };
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(validBody, clientHeader));
      expect(res.status).toBe(200);
    }
    const res = await POST(makeRequest(validBody, clientHeader));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toMatch(/too many/i);
  });

  describe('Origin enforcement (CSRF)', () => {
    const validBody = { name: 'Frodo', email: 'frodo@shire.me', message: 'Hello!' };

    it('returns 403 when Origin header is missing', async () => {
      const req = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': nextTestIp() },
        body: JSON.stringify(validBody),
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });

    it('returns 403 for a cross-origin request', async () => {
      const res = await POST(
        makeRequest(validBody, { Origin: 'https://evil.example', 'x-forwarded-for': nextTestIp() }),
      );
      expect(res.status).toBe(403);
    });

    it('returns 200 for the production origin', async () => {
      const res = await POST(
        makeRequest(validBody, {
          Origin: 'https://zachlamb.io',
          'x-forwarded-for': nextTestIp(),
        }),
      );
      expect(res.status).toBe(200);
    });

    it('allows Vercel preview deploys matching the project', async () => {
      const res = await POST(
        makeRequest(validBody, {
          Origin: 'https://zachlamb-git-pr-123.vercel.app',
          'x-forwarded-for': nextTestIp(),
        }),
      );
      expect(res.status).toBe(200);
    });

    it('rejects a non-https Origin that spoofs the vercel.app suffix', async () => {
      const res = await POST(
        makeRequest(validBody, {
          Origin: 'http://zachlamb.vercel.app.evil.example',
          'x-forwarded-for': nextTestIp(),
        }),
      );
      expect(res.status).toBe(403);
    });
  });

  describe('Header injection defense', () => {
    it('strips CR/LF from the subject line before calling Resend', async () => {
      const res = await POST(
        makeRequest(
          {
            name: 'Evil\r\nBcc: attacker@example.com',
            email: 'frodo@shire.me',
            message: 'Hello!',
          },
          { 'x-forwarded-for': nextTestIp() },
        ),
      );
      expect(res.status).toBe(200);
      expect(sendMock).toHaveBeenCalled();
      const subject = sendMock.mock.calls.at(-1)?.[0]?.subject as string;
      expect(subject).toBeDefined();
      expect(subject).not.toMatch(/[\r\n]/);
    });
  });

  describe('RESEND_FROM_EMAIL hygiene', () => {
    it('falls back to onboarding@resend.dev outside production (test env)', async () => {
      const res = await POST(
        makeRequest(
          { name: 'Frodo', email: 'frodo@shire.me', message: 'Hello!' },
          { 'x-forwarded-for': nextTestIp() },
        ),
      );
      expect(res.status).toBe(200);
      const from = sendMock.mock.calls.at(-1)?.[0]?.from as string;
      expect(from).toContain('onboarding@resend.dev');
    });

    it('fails closed in production when RESEND_FROM_EMAIL is unset', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      try {
        const res = await POST(
          makeRequest(
            { name: 'Frodo', email: 'frodo@shire.me', message: 'Hello!' },
            { 'x-forwarded-for': nextTestIp() },
          ),
        );
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.error).toMatch(/not configured/i);
      } finally {
        vi.unstubAllEnvs();
        vi.stubEnv('RESEND_API_KEY', 'test_key');
      }
    });
  });
});
