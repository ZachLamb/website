import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { siteConfig } from '@/data/site';
import { inter, cormorantGaramond } from '@/lib/fonts';
import { defaultLocale, isValidLocale } from '@/lib/i18n';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const localeHeader = headersList.get('x-next-locale') ?? '';
  const lang = isValidLocale(localeHeader) ? localeHeader : defaultLocale;

  return (
    <html lang={lang} className={`${inter.variable} ${cormorantGaramond.variable}`}>
      <body className="min-h-[100dvh] min-h-screen antialiased">{children}</body>
    </html>
  );
}
