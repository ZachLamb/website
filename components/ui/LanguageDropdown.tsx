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
    // Preserve the current hash so switching locales keeps the user on the
    // same section (e.g. /en#services -> /ja#services) rather than dropping
    // them back at the top of the page.
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    router.push(`/${value}${hash}`);
  }

  const label = messages.nav.selectLanguage;

  return (
    <div className={cn('relative', compact ? 'block' : 'inline-block', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={locale}
        onChange={handleChange}
        aria-label={label}
        className={cn(
          // text-base below lg: iOS Safari zooms the whole page in when a
          // form control with text smaller than 16px takes focus, and does
          // not zoom back out afterwards.
          'border-contour/50 bg-paper-raised text-ink hover:border-blaze focus-visible:ring-blaze min-h-11 cursor-pointer appearance-none rounded-md border py-1.5 pr-9 pl-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none lg:min-h-0 lg:text-sm',
          compact ? 'w-full' : 'min-w-28',
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
        className="text-ink-soft pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2"
      />
    </div>
  );
}
