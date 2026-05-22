import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { inter, cormorantGaramond } from '@/lib/fonts';
import { defaultLocale } from '@/lib/i18n';
import { SwKillSwitch } from '@/components/providers/SwKillSwitch';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={defaultLocale} className={`${inter.variable} ${cormorantGaramond.variable}`}>
      <body className="min-h-[100dvh] min-h-screen antialiased">
        <SwKillSwitch />
        {children}
      </body>
    </html>
  );
}
