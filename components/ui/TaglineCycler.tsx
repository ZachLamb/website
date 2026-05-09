'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';

type Props = {
  taglines: readonly string[];
  intervalMs?: number;
  className?: string;
};

/**
 * Cycles through a list of taglines with a fade/slide transition.
 * - Pauses on hover/focus so readers can dwell on one line.
 * - Respects prefers-reduced-motion: renders ALL variants stacked instead
 *   of cycling, so the full message is reachable without forcing the user
 *   to wait through animations they explicitly opted out of.
 * - Marks the cycling region with role="region" + aria-live="polite" so
 *   screen readers announce each new tagline as it rotates in.
 * - A single-entry list also renders statically (no interval, no aria-live).
 *
 * Default intervalMs is 6000ms — slow enough to satisfy WCAG 2.2.2 (Pause,
 * Stop, Hide) given the longest English variant takes ~5.7s to read at the
 * average pace, and pause-on-hover/focus is a working secondary control.
 */
export function TaglineCycler({ taglines, intervalMs = 6000, className }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || paused || taglines.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % taglines.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, paused, prefersReducedMotion, taglines.length]);

  const safeIndex = Math.min(index, Math.max(0, taglines.length - 1));
  const current = taglines[safeIndex] ?? '';

  // Reduced-motion or single-entry list: show every variant statically so the
  // full message is reachable. Avoids the H1 a11y issue where reduced-motion
  // users would only see the first (longest, densest) tagline.
  if (prefersReducedMotion || taglines.length <= 1) {
    return (
      <div className={className}>
        {taglines.map((t, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : undefined}>
            {t}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="rotating tagline"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <m.p
          key={safeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {current}
        </m.p>
      </AnimatePresence>
    </div>
  );
}
