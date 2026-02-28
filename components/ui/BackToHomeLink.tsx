'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { isValidLocale } from '@/lib/i18n';

/**
 * Renders a "Return to the Shire" / home link that points to the current locale root
 * when the user is under a locale path (e.g. /en/foo → /en), otherwise to /.
 */
export function BackToHomeLink() {
  const pathname = usePathname();
  const segment = pathname?.slice(1).split('/')[0];
  const href = isValidLocale(segment) ? `/${segment}` : '/';
  return <Button href={href}>Return to the Shire</Button>;
}
