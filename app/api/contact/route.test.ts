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

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
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
      headers: { 'Content-Type': 'application/json' },
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
});
