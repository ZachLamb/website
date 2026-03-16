const { incrMock, expireMock, lpushMock, sendMock } = vi.hoisted(() => ({
  incrMock: vi.fn(),
  expireMock: vi.fn(),
  lpushMock: vi.fn(),
  sendMock: vi.fn().mockResolvedValue({ data: { id: 'email-id' }, error: null }),
}));

vi.mock('@vercel/kv', () => ({
  kv: {
    incr: incrMock,
    expire: expireMock,
    lpush: lpushMock,
  },
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.stubEnv('RESEND_API_KEY', 'test-key');

import { POST } from './route';

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/myspace/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-vercel-ip-hash': 'test-client' },
    body: JSON.stringify(body),
  });
}

function validBody() {
  return {
    name: 'Alex',
    age: '28',
    location: 'Denver, CO',
    instagram: '@alex',
    pitch: 'I am kind, funny, and I bring snacks.',
    loveLanguage: 'Quality Time',
    oreoPreference: 'Double Stuf',
    petOpinion: 'Dog person',
    idealDate: 'Hiking then tacos',
    travelStyle: 'Half adventure, half relaxing (like Snack)',
    bigSpoon: 'Big spoon',
  };
}

describe('POST /api/snack/apply', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    incrMock.mockResolvedValue(1);
    expireMock.mockResolvedValue(1);
    lpushMock.mockResolvedValue(1);
  });

  it('returns 400 for invalid JSON payload', async () => {
    const req = new Request('http://localhost/api/myspace/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json',
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid JSON' });
  });

  it('requires travelStyle in canonical schema', async () => {
    const body: Record<string, unknown> = { ...validBody() };
    delete body.travelStyle;

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('travelStyle is required');
  });

  it('accepts legacy dogOpinion and stores canonical petOpinion', async () => {
    const body: Record<string, unknown> = { ...validBody() };
    delete body.petOpinion;
    body.dogOpinion = 'Dog person';

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(200);
    expect(lpushMock).toHaveBeenCalledTimes(1);
    expect(lpushMock).toHaveBeenCalledWith('myspace:applications', expect.any(String));

    const [, payload] = lpushMock.mock.calls[0] as [string, string];
    const stored = JSON.parse(payload) as Record<string, string>;
    expect(stored.petOpinion).toBe('Dog person');
    expect(stored.travelStyle).toBe('Half adventure, half relaxing (like Snack)');
    expect(stored).not.toHaveProperty('dogOpinion');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    incrMock.mockResolvedValue(4);

    const res = await POST(makeRequest(validBody()));

    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toMatch(/too many submissions/i);
    expect(lpushMock).not.toHaveBeenCalled();
  });

  it('silently discards submission when honeypot field is filled', async () => {
    const body = { ...validBody(), website: 'http://spam.example.com' };

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    // Should NOT store or email
    expect(lpushMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently discards submission when form is submitted too quickly', async () => {
    const body = { ...validBody(), _t: Date.now().toString() };

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(lpushMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('allows submission when timestamp is old enough', async () => {
    const body = { ...validBody(), _t: (Date.now() - 5000).toString() };

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(200);
    expect(lpushMock).toHaveBeenCalledTimes(1);
  });

  it('stores submission and sends email on valid request', async () => {
    const res = await POST(makeRequest(validBody()));

    expect(res.status).toBe(200);
    expect(lpushMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const [, payload] = lpushMock.mock.calls[0] as [string, string];
    const stored = JSON.parse(payload) as Record<string, unknown>;
    expect(stored.name).toBe('Alex');
    expect(stored.age).toBe(28);
    expect(stored.location).toBe('Denver, CO');
    expect(stored.pitch).toBe('I am kind, funny, and I bring snacks.');
    expect(stored).toHaveProperty('id');
    expect(stored).toHaveProperty('submittedAt');
  });

  it('returns 400 for missing required fields', async () => {
    const body: Record<string, unknown> = { ...validBody() };
    delete body.name;

    const res = await POST(makeRequest(body));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('name is required');
  });

  it('returns 400 for invalid age', async () => {
    const res = await POST(makeRequest({ ...validBody(), age: '15' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid age');
  });

  it('returns 400 when input exceeds max length', async () => {
    const res = await POST(makeRequest({ ...validBody(), name: 'A'.repeat(101) }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Input exceeds maximum length');
  });
});
