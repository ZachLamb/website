import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/data/site';
import { inter, cormorantGaramond, plexMono } from '@/lib/fonts';
import { defaultLocale } from '@/lib/i18n';
import { SwKillSwitch } from '@/components/providers/SwKillSwitch';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Matches the header, so the browser chrome on a phone continues the page.
  themeColor: '#f4efe2',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      className={`${inter.variable} ${cormorantGaramond.variable} ${plexMono.variable}`}
      // Tells Next the smooth scrolling on <html> is intentional, so it
      // switches it off while it resets scroll on a route change. Without
      // it, opening the privacy page from the footer animates up from the
      // bottom of the page instead of starting at the top.
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh antialiased">
        <SwKillSwitch />
        {children}
      </body>
    </html>
  );
}
