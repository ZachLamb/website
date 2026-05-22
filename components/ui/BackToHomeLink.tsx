'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { isValidLocale } from '@/lib/i18n';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

export function BackToHomeLink() {
  const { messages } = useLocaleContext();
  const pathname = usePathname();
  const segment = pathname?.slice(1).split('/')[0];
  const href = isValidLocale(segment) ? `/${segment}` : '/';
  return <Button href={href}>{messages.nav.backToTop}</Button>;
}
