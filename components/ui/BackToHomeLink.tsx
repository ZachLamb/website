'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { isValidLocale } from '@/lib/i18n';
import { LocaleContext } from '@/components/providers/LocaleProvider';

/**
 * Link back to the locale-aware homepage. Gracefully falls back to
 * "Return to the trail" when rendered outside LocaleProvider (e.g. the
 * root not-found page which lives above the [locale] segment).
 */
export function BackToHomeLink() {
  const ctx = useContext(LocaleContext);
  const label = ctx?.messages.nav.backToTop ?? 'Return to the trail';
  const pathname = usePathname();
  const segment = pathname?.slice(1).split('/')[0];
  const href = isValidLocale(segment) ? `/${segment}` : '/';
  return <Button href={href}>{label}</Button>;
}
