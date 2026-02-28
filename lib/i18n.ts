export const locales = ['en', 'es', 'de', 'it', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];

/** Display names for language dropdown (in each language for consistency use native names) */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '日本語',
  zh: '中文',
};

export const defaultLocale: Locale = 'en';

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Maps Accept-Language style codes (e.g. en-US, es-ES) to supported locale.
 */
export function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage?.trim()) return defaultLocale;
  const parts = acceptLanguage.split(',').map((s) => s.split(';')[0].trim().toLowerCase());
  for (const part of parts) {
    const lang = part.split('-')[0];
    if (lang === 'en') return 'en';
    if (lang === 'es') return 'es';
    if (lang === 'de') return 'de';
    if (lang === 'it') return 'it';
    if (lang === 'ja') return 'ja';
    if (lang === 'zh') return 'zh';
  }
  return defaultLocale;
}

import en from '@/messages/en.json';
import es from '@/messages/es.json';
import de from '@/messages/de.json';
import it from '@/messages/it.json';
import ja from '@/messages/ja.json';
import zh from '@/messages/zh.json';

export type Messages = typeof en;

const messagesMap: Record<Locale, Messages> = { en, es, de, it, ja, zh };

export function getMessages(locale: Locale): Messages {
  return messagesMap[locale] ?? en;
}
