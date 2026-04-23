// @vitest-environment node
// Node's native Request is required here so NextRequest behaves like it does at
// runtime. happy-dom strips forbidden request headers, which is fine for most
// middleware assertions but not worth the subtle gotchas.

import { NextRequest } from 'next/server';
import { proxy, config } from './proxy';

function makeRequest(
  url: string,
  headers: Record<string, string> = {},
  cookie?: string,
): NextRequest {
  return new NextRequest(new URL(url), {
    headers: { ...headers, ...(cookie ? { cookie } : {}) },
  });
}

describe('proxy (locale middleware)', () => {
  describe('root path locale resolution', () => {
    it('redirects "/" with no cookie and no Accept-Language to /en', () => {
      const res = proxy(makeRequest('http://localhost/'));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/en');
    });

    it('redirects "/" with accept-language "de-DE,en;q=0.9" to /de', () => {
      const res = proxy(makeRequest('http://localhost/', { 'accept-language': 'de-DE,en;q=0.9' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/de');
    });

    it('redirects "/" with accept-language "es-ES" to /es', () => {
      const res = proxy(makeRequest('http://localhost/', { 'accept-language': 'es-ES' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/es');
    });

    it('honors cookie over accept-language when cookie locale is valid', () => {
      const res = proxy(
        makeRequest('http://localhost/', { 'accept-language': 'de' }, 'NEXT_LOCALE=ja'),
      );
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/ja');
    });

    it('falls back to accept-language when cookie locale is invalid', () => {
      const res = proxy(
        makeRequest('http://localhost/', { 'accept-language': 'it' }, 'NEXT_LOCALE=xx'),
      );
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/it');
    });

    it('picks the first supported locale in ordered Accept-Language', () => {
      // fr is not in the supported set; the first hit in iteration order is it.
      const res = proxy(makeRequest('http://localhost/', { 'accept-language': 'fr,it;q=0.5' }));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/it');
    });
  });

  describe('locale-prefixed paths', () => {
    it('passes through /en/about with x-next-locale: en', () => {
      const res = proxy(makeRequest('http://localhost/en/about'));
      expect(res.status).toBe(200);
      expect(res.headers.get('x-next-locale')).toBe('en');
    });

    it('passes through /zh/skills with x-next-locale: zh', () => {
      const res = proxy(makeRequest('http://localhost/zh/skills'));
      expect(res.status).toBe(200);
      expect(res.headers.get('x-next-locale')).toBe('zh');
    });

    it('redirects unsupported URL locale /fr/about to /en (defaultLocale)', () => {
      const res = proxy(makeRequest('http://localhost/fr/about'));
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost/en');
    });
  });

  describe('excluded paths (handler short-circuits)', () => {
    it('passes through /api/contact without setting x-next-locale', () => {
      const res = proxy(makeRequest('http://localhost/api/contact'));
      expect(res.status).toBe(200);
      expect(res.headers.get('location')).toBeNull();
      expect(res.headers.get('x-next-locale')).toBeNull();
    });

    it('passes through /logo.png (file with an extension)', () => {
      const res = proxy(makeRequest('http://localhost/logo.png'));
      expect(res.status).toBe(200);
      expect(res.headers.get('location')).toBeNull();
      expect(res.headers.get('x-next-locale')).toBeNull();
    });

    it('passes through /_next/static/foo.js', () => {
      const res = proxy(makeRequest('http://localhost/_next/static/foo.js'));
      expect(res.status).toBe(200);
      expect(res.headers.get('location')).toBeNull();
      expect(res.headers.get('x-next-locale')).toBeNull();
    });
  });

  describe('exported matcher config', () => {
    it('exposes a matcher that excludes api, _next, and dotted paths', () => {
      expect(config).toEqual({ matcher: ['/((?!api|_next|.*\\.).*)'] });
    });
  });
});
