import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { siteConfig } from '@/data/site';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TrailExtension } from '@/components/ui/TrailExtension';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { getMessages, isValidLocale, type Locale } from '@/lib/i18n';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }
  const messages = getMessages(locale as Locale);
  const canonical = locale === 'en' ? siteConfig.url : `${siteConfig.url}/${locale}`;
  return {
    metadataBase: new URL(siteConfig.url),
    title: `${messages.site.name} | ${messages.site.title}`,
    description: messages.site.description,
    alternates: {
      canonical,
      languages: { en: siteConfig.url, es: `${siteConfig.url}/es`, de: `${siteConfig.url}/de` },
    },
    openGraph: {
      title: `${messages.site.name} | ${messages.site.title}`,
      description: messages.site.description,
      url: canonical,
      siteName: messages.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${messages.site.name} | ${messages.site.title}`,
      description: messages.site.description,
    },
    other: { 'theme-color': '#2C3E2D' },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    redirect('/');
  }
  const messages = getMessages(locale as Locale);
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person' as const,
    name: messages.site.name,
    url: siteConfig.url,
    jobTitle: messages.site.title,
    description: messages.site.description,
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin].filter(Boolean),
  };

  return (
    <LocaleProvider locale={locale as Locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <a
        href="#main-content"
        className="focus:bg-gold focus:text-parchment sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2"
      >
        {messages.common.skipToContent}
      </a>
      <TrailExtension />
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <Analytics />
    </LocaleProvider>
  );
}
