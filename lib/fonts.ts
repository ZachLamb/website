import { Cormorant_Garamond, Inter } from 'next/font/google';

// Font display: 'swap' shows fallback text immediately, swaps to web font
// when loaded. This avoids FOIT (flash of invisible text) and keeps LCP fast.
// Next.js automatically self-hosts these via next/font, so no external
// requests to fonts.googleapis.com.

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '600', '700'],
});
