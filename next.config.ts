import path from 'node:path';
import type { NextConfig } from 'next';

// Content Security Policy.
// - 'unsafe-inline' is needed for styles because Next/Tailwind inject inline
//   style attributes. We could swap to nonces once the stack supports it.
// - 'unsafe-inline' is also required on script-src because the JSON-LD tag in
//   [locale]/layout.tsx uses dangerouslySetInnerHTML. Inputs are fully static,
//   so this is safe today; if user-authored content ever reaches that tag, we
//   must move to nonced scripts.
// - Vercel Analytics ships from va.vercel-scripts.com.
// - frame-ancestors 'none' makes X-Frame-Options redundant (we keep XFO as a
//   belt-and-suspenders for clients that ignore the CSP directive).
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: csp },
  // HSTS: 2 years, include subdomains, preload-ready. Only takes effect over HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
