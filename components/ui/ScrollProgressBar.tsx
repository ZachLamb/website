'use client';

import { useScrollProgress } from '@/hooks/useScrollProgress';

export function ScrollProgressBar() {
  useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="bg-gold/80 pointer-events-none fixed top-16 left-0 z-50 h-0.5 origin-left"
      style={{
        transform: 'scaleX(var(--scroll-progress, 0))',
        width: '100%',
      }}
    />
  );
}
