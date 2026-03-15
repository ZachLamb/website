import path from 'node:path';
import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  async redirects() {
    return [
      { source: '/snack', destination: '/myspace', permanent: true },
      { source: '/snack/:path((?!.*\\.).*)', destination: '/myspace/:path', permanent: true },
      { source: '/api/snack/:path*', destination: '/api/myspace/:path*', permanent: true },
      { source: '/myspace/profile.jpg', destination: '/snack/profile.jpg', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
