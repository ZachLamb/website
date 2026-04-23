import {
  isValidLocale,
  getLocaleFromAcceptLanguage,
  getMessages,
  locales,
  type Locale,
} from './i18n';

describe('isValidLocale', () => {
  it('returns true for supported locale "en"', () => {
    expect(isValidLocale('en')).toBe(true);
  });

  it('returns true for supported locale "zh"', () => {
    expect(isValidLocale('zh')).toBe(true);
  });

  it('returns false for unsupported locale "fr"', () => {
    expect(isValidLocale('fr')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidLocale('')).toBe(false);
  });

  it('returns false for uppercase "EN" (case sensitive)', () => {
    expect(isValidLocale('EN')).toBe(false);
  });

  it('returns false for full BCP-47 tag "en-US"', () => {
    expect(isValidLocale('en-US')).toBe(false);
  });
});

describe('getLocaleFromAcceptLanguage', () => {
  it.each<[string | null, Locale]>([
    [null, 'en'],
    ['', 'en'],
    ['  ', 'en'],
    ['en', 'en'],
    ['en-US,en;q=0.9', 'en'],
    ['de-DE', 'de'],
    ['de', 'de'],
    ['ja', 'ja'],
    ['zh-CN', 'zh'],
    ['zh-Hans', 'zh'],
    ['fr,it;q=0.5', 'it'],
    ['xx-YY', 'en'],
    ['es-ES,it;q=0.5', 'es'],
    ['EN', 'en'],
    ['fr,,es', 'es'],
    ['ja;q=1,', 'ja'],
  ])('returns %s -> %s', (input, expected) => {
    expect(getLocaleFromAcceptLanguage(input)).toBe(expected);
  });
});

describe('getMessages', () => {
  it('returns an object containing site and nav keys for "en"', () => {
    const messages = getMessages('en');
    expect(messages).toHaveProperty('site');
    expect(messages).toHaveProperty('nav');
  });

  it('returns Messages for "ja" with a non-empty site.name string', () => {
    const messages = getMessages('ja');
    expect(typeof messages.site.name).toBe('string');
    expect(messages.site.name.length).toBeGreaterThan(0);
  });

  it('loads all 6 locales without throwing', () => {
    expect(() => locales.forEach((l) => getMessages(l))).not.toThrow();
  });

  it('falls back to "en" messages for an unknown locale (via ?? fallback)', () => {
    const fallback = getMessages('xx' as unknown as Locale);
    const en = getMessages('en');
    expect(fallback).toBe(en);
  });
});
