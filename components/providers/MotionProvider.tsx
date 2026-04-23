'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Wraps the app in Framer Motion's LazyMotion so the full motion feature
 * bundle is loaded on demand instead of pulled into every client bundle that
 * imports `motion.*`. Pair with `m.*` (lowercase) components throughout the
 * tree — the `strict` flag will throw at runtime if a `motion.*` slips in,
 * which is the safety net for this migration.
 *
 * We use `domAnimation` (not `domMax`) because this site has no drag or
 * layout animations — only animate/whileHover/whileInView/variants/etc.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
