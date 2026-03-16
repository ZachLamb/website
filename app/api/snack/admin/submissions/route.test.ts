const { lrangeMock, authMock } = vi.hoisted(() => ({
  lrangeMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@vercel/kv', () => ({
  kv: {
    lrange: lrangeMock,
  },
}));

vi.mock('@/auth', () => ({
  auth: authMock,
}));

vi.stubEnv('MYSPACE_ADMIN_USERNAME', 'admin@example.com');

import { GET } from './route';

describe('GET /api/snack/admin/submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMock.mockResolvedValue({ user: { email: 'admin@example.com' } });
  });

  it('returns 401 when not authenticated', async () => {
    authMock.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 when email does not match allowed admin', async () => {
    authMock.mockResolvedValue({ user: { email: 'stranger@example.com' } });
    const res = await GET();
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('returns submissions for authorized admin', async () => {
    lrangeMock.mockResolvedValue([
      JSON.stringify({
        id: 'a1',
        name: 'Alex',
        petOpinion: 'Dog person',
        travelStyle: 'Adventure',
      }),
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.submissions).toHaveLength(1);
    expect(json.submissions[0]).toMatchObject({
      id: 'a1',
      name: 'Alex',
      petOpinion: 'Dog person',
      travelStyle: 'Adventure',
    });
  });

  it('returns 500 when KV read fails', async () => {
    lrangeMock.mockRejectedValue(new Error('kv down'));

    const res = await GET();
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Failed to fetch submissions' });
  });
});
