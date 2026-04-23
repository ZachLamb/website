'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Props = {
  taglines: readonly string[];
  intervalMs?: number;
  className?: string;
};

/**
 * Cycles through a list of taglines with a fade/slide transition.
 * - Pauses on hover/focus so readers can dwell on one line.
 * - Respects prefers-reduced-motion: shows the first tagline statically.
 * - A single-entry list also renders statically (no interval work).
 */
export function TaglineCycler({ taglines, intervalMs = 3000, className }: Props) {
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

  if (prefersReducedMotion || taglines.length <= 1) {
    return <p className={className}>{current}</p>;
  }

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={safeIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {current}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
