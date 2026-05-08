import { subProcessors } from './sub-processors';

describe('sub-processors', () => {
  it('has at least one entry', () => {
    expect(subProcessors.length).toBeGreaterThan(0);
  });

  it('every entry has a unique id', () => {
    const ids = subProcessors.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every entry has a non-empty name and purpose', () => {
    for (const proc of subProcessors) {
      expect(proc.name.trim().length).toBeGreaterThan(0);
      expect(proc.purpose.trim().length).toBeGreaterThan(0);
    }
  });

  it('every privacy URL parses as https://', () => {
    for (const proc of subProcessors) {
      const url = new URL(proc.url);
      expect(url.protocol).toBe('https:');
    }
  });

  // Pin the disclosure invariant: any of these three vendors that the site
  // actively uses (Vercel for hosting + analytics, Resend for email, Sentry
  // for errors) must appear here. If a future commit adds an integration
  // without updating this list, this assertion fails before the privacy
  // page silently misrepresents the data flow.
  it.each(['vercel', 'resend', 'sentry'])('discloses the %s sub-processor', (id) => {
    const ids = subProcessors.map((p) => p.id);
    expect(ids).toContain(id);
  });
});
