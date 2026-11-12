'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useHydrated';

type Props = {
  taglines: readonly string[];
  intervalMs?: number;
  className?: string;
};

/**
 * Cycles through a list of taglines with a cross-fade.
 *
 * Every tagline is rendered at once, stacked in a single grid cell, and
 * only the current one is visible. The cell is therefore always as tall as
 * the longest line, so rotating never changes the height of the hero. (It
 * used to: a tagline that wrapped to an extra line pushed the whole page
 * down, and iOS Safari, which has no scroll anchoring, moved whatever the
 * reader was looking at further down the page every few seconds.)
 *
 * - Pauses on hover/focus so readers can dwell on one line.
 * - Respects prefers-reduced-motion: renders ALL variants as a plain list
 *   instead of cycling, so the full message is reachable without waiting
 *   through animation the user opted out of.
 * - aria-live="polite" announces each new tagline; the hidden ones are
 *   aria-hidden so only the current line is read.
 * - A single-entry list also renders statically (no interval, no aria-live).
 *
 * Default intervalMs is 6000ms — slow enough to satisfy WCAG 2.2.2 (Pause,
 * Stop, Hide) given the longest English variant takes ~5.7s to read, and
 * pause-on-hover/focus is a working secondary control.
 */
export function TaglineCycler({ taglines, intervalMs = 6000, className }: Props) {
  // False until hydrated: the server always renders the cycling markup, and
  // the plain list replaces it once the preference is known.
  const prefersReducedMotion = usePrefersReducedMotion();
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
      // tabIndex=0 makes the cycler reachable by keyboard, so focus can
      // pause the rotation (WCAG 2.2.2). Mouse users pause by hovering.
      tabIndex={0}
      className={cn(
        'focus-visible:ring-blaze focus-visible:ring-offset-paper grid rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-4',
        className,
      )}
      role="region"
      aria-roledescription="rotating tagline"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {taglines.map((t, i) => {
        const current = i === safeIndex;
        return (
          <p
            key={i}
            aria-hidden={current ? undefined : true}
            data-current={current}
            className={cn(
              'col-start-1 row-start-1 transition-opacity duration-500',
              current ? 'opacity-100' : 'opacity-0',
            )}
          >
            {t}
          </p>
        );
      })}
    </div>
  );
}
