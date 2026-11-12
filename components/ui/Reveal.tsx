'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait after entering the viewport; use for small staggers. */
  delay?: number;
  as?: 'div' | 'li';
}

/**
 * Fades its children up once, the first time they scroll into view. The
 * motion is a CSS transition (see `.reveal` in globals.css), so it costs
 * nothing while scrolling and is switched off wholesale by the
 * reduced-motion rule there. app/[locale]/layout.tsx ships a <noscript>
 * override so the content is never left hidden if scripts do not run.
 */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });

  return (
    <Tag
      // The two tags share every attribute used here; the ref type is the
      // only thing TypeScript cannot unify across them.
      ref={ref as React.Ref<HTMLDivElement & HTMLLIElement>}
      data-revealed={inView}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      className={cn('reveal', className)}
    >
      {children}
    </Tag>
  );
}
