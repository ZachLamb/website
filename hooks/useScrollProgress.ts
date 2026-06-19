'use client';

import { useEffect } from 'react';

export function useScrollProgress() {
  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, scrollY / docHeight) : 0;
        document.documentElement.style.setProperty('--scroll-progress', String(progress));
        document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
