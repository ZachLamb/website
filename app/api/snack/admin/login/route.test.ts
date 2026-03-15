const { getMock, incrMock, expireMock, setMock, delMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  incrMock: vi.fn(),
  expireMock: vi.fn(),
  setMock: vi.fn(),
  delMock: vi.fn(),
}));

vi.mock('@vercel/kv', () => ({
  kv: {
    get: getMock,
    incr: incrMock,
    expire: expireMock,
    set: setMock,
    del: delMock,
  },
}));

vi.stubEnv('MYSPACE_ADMIN_PASSWORD', 'super-secret');
vi.stubEnv('RESEND_API_KEY', 'test-secret');

import { POST, verifyAdminCookie } from './route';

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/myspace/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-vercel-ip-hash': 'admin-client' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/snack/admin/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockResolvedValue(null);
    incrMock.mockResolvedValue(1);
    expireMock.mockResolvedValue(1);
    setMock.mockResolvedValue('OK');
    delMock.mockResolvedValue(1);
  });

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Password required' });
  });

  it('returns 401 for invalid password', async () => {
    const res = await POST(makeRequest({ password: 'wrong' }));
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid password' });
    expect(incrMock).toHaveBeenCalledTimes(1);
  });

  it('returns success and sets admin cookie for valid password', async () => {
    const res = await POST(makeRequest({ password: 'super-secret' }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });

    const cookieHeader = res.headers.get('set-cookie');
    expect(cookieHeader).toBeTruthy();
    expect(cookieHeader).toContain('myspace_admin=');
    expect(cookieHeader).toContain('Path=/myspace/admin');
    expect(delMock).toHaveBeenCalled();
  });

  it('verifyAdminCookie returns true only for a valid token', async () => {
    const res = await POST(makeRequest({ password: 'super-secret' }));
    const cookieHeader = res.headers.get('set-cookie');
    const token = cookieHeader?.match(/myspace_admin=([^;]+)/)?.[1];

    expect(verifyAdminCookie(token)).toBe(true);
    expect(verifyAdminCookie('invalid-token')).toBe(false);
  });
});
