'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

export function BackToTopButton() {
  const { messages } = useLocaleContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      data-print-hidden
      // Always mounted and faded, rather than added and removed: the button
      // appearing must never be able to shift anything else on the page.
      inert={!visible}
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label={messages.footer?.backToTop ?? 'Back to top'}
      className={cn(
        'bg-ink text-paper border-paper/30 hover:bg-blaze focus-visible:ring-blaze fixed z-40 flex h-12 w-12 touch-manipulation items-center justify-center rounded-full border shadow-lg transition-[opacity,scale,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        visible ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0',
      )}
      style={{
        bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
        right: 'max(1.25rem, calc(env(safe-area-inset-right) + 0.75rem))',
      }}
    >
      <ArrowUp aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}
