import { Big_Shoulders, Cormorant_Garamond, IBM_Plex_Mono, Inter } from 'next/font/google';

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

// The map's data voice: waypoint numbers, dates, coordinates, legend keys.
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
});

// The poster voice: tall, heavy, condensed capitals, in the manner of the
// hand-cut gothic lettering on screen-printed national park posters. Used
// for the name, section titles and labels; never for running text.
export const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['600', '800', '900'],
});
