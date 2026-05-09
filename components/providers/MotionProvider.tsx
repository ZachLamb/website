'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';

/**
 * Wraps the app in Framer Motion's LazyMotion so the full motion feature
 * bundle is loaded on demand instead of pulled into every client bundle that
 * imports `motion.*`. Pair with `m.*` (lowercase) components throughout the
 * tree — the `strict` flag will throw at runtime if a `motion.*` slips in,
 * which is the safety net for this migration.
 *
 * We use `domAnimation` (not `domMax`) because this site has no drag or
 * layout animations — only animate/whileHover/whileInView/variants/etc.
 *
 * `MotionConfig reducedMotion="user"` honors the OS-level "Reduce Motion"
 * preference for every `m.*` consumer in the tree. Framer Motion will
 * short-circuit transforms (translate/scale/rotate) to their end-state and
 * skip transitions when the user has Reduce Motion set. WCAG 2.3.3.
 * Per-component `useReducedMotion()` checks still work — this provides the
 * default so we don't have to wire it through every consumer.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
