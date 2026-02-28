'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { locales, localeNames, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function setLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

type LanguageDropdownProps = {
  className?: string;
  /** Compact style for mobile (smaller, full width in menu) */
  compact?: boolean;
  /** Optional id for the select (use when multiple dropdowns exist, e.g. desktop + mobile) */
  id?: string;
};

export function LanguageDropdown({
  className,
  compact,
  id = 'language-select',
}: LanguageDropdownProps) {
  const { locale, messages } = useLocaleContext();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as Locale;
    if (value === locale) return;
    setLocaleCookie(value);
    router.push(value === 'en' ? '/en' : `/${value}`);
  }

  const label = messages.nav.selectLanguage;

  return (
    <div className={cn('relative inline-block', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={locale}
        onChange={handleChange}
        aria-label={label}
        className={cn(
          'border-bark/20 bg-parchment/80 text-bark hover:border-gold/40 hover:text-gold focus:border-gold focus:ring-gold/50 cursor-pointer appearance-none rounded-md border py-1.5 pr-8 pl-3 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none',
          compact ? 'w-full max-w-40' : 'min-w-28',
        )}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="text-bark/60 pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2"
      />
    </div>
  );
}
