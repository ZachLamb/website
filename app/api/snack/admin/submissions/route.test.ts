import { NextRequest } from 'next/server';

const { lrangeMock, verifyAdminCookieMock } = vi.hoisted(() => ({
  lrangeMock: vi.fn(),
  verifyAdminCookieMock: vi.fn(),
}));

vi.mock('@vercel/kv', () => ({
  kv: {
    lrange: lrangeMock,
  },
}));

vi.mock('../login/route', () => ({
  verifyAdminCookie: verifyAdminCookieMock,
}));

import { GET } from './route';

function makeRequest(cookie?: string): NextRequest {
  const headers = new Headers();
  if (cookie) {
    headers.set('Cookie', `myspace_admin=${cookie}`);
  }

  const request = new Request('http://localhost/api/myspace/admin/submissions', {
    method: 'GET',
    headers,
  });
  return new NextRequest(request);
}

describe('GET /api/snack/admin/submissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyAdminCookieMock.mockReturnValue(true);
  });

  it('returns 401 when admin cookie is missing', async () => {
    verifyAdminCookieMock.mockReturnValueOnce(false);
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('returns submissions for authorized admin cookie', async () => {
    lrangeMock.mockResolvedValue([
      JSON.stringify({
        id: 'a1',
        name: 'Alex',
        petOpinion: 'Dog person',
        travelStyle: 'Adventure',
      }),
    ]);
    const token = 'valid-token';

    const res = await GET(makeRequest(token));
    expect(verifyAdminCookieMock).toHaveBeenCalled();
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
    const token = 'valid-token';

    const res = await GET(makeRequest(token));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Failed to fetch submissions' });
  });
});
