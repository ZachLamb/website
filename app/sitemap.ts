import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { locales } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return locales.map((locale) => ({
    url: locale === 'en' ? siteConfig.url : `${siteConfig.url}/${locale}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 1,
  }));
}
