export const locales = ['en', 'es', 'de'] as const;
export type Locale = (typeof locales)[number];

/** Display names for language dropdown (in each language for consistency use native names) */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
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
  }
  return defaultLocale;
}

import en from '@/messages/en.json';
import es from '@/messages/es.json';
import de from '@/messages/de.json';

export type Messages = typeof en;

const messagesMap: Record<Locale, Messages> = { en, es, de };

export function getMessages(locale: Locale): Messages {
  return messagesMap[locale] ?? en;
}
