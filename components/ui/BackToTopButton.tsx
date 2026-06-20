'use client';

import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
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
    <AnimatePresence>
      {visible && (
        <m.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label={messages.footer?.backToTop ?? 'Back to top'}
          className="bg-gold/90 text-forest hover:bg-gold focus-visible:ring-gold fixed z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          style={{
            bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))',
            right: '1.5rem',
          }}
        >
          <Compass className="h-5 w-5" />
        </m.button>
      )}
    </AnimatePresence>
  );
}
