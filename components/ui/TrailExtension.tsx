'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/useHydrated';
import { TRAIL_GUTTER_CLASS } from '@/lib/trail-position';

/**
 * Winding trail line that extends from the hero down the page and
 * "draws" as the user scrolls, communicating that they're following the path.
 * A smooth S-curve meander (not sharp zigzag turns) so it reads as an
 * organic trail/river line on a map, not a literal progress bar or a
 * lightning bolt.
 */
export function TrailExtension() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 0.05, 0.5, 1], [0, 0.05, 0.5, 1]);

  return (
    <div aria-hidden className={TRAIL_GUTTER_CLASS}>
      <svg className="h-full w-full" viewBox="0 0 24 100" preserveAspectRatio="none">
        <m.path
          d="M 12 0 C 20 8, 4 17, 12 25 S 20 42, 12 50 S 4 67, 12 75 S 20 92, 12 100"
          fill="none"
          stroke="rgba(184,134,11,0.5)"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          // With reduced motion the whole dashed trail shows, no scroll-draw.
          // Keyed so the path remounts without framer's pathLength dash
          // attributes when the preference becomes known after hydration.
          key={prefersReducedMotion ? 'static' : 'draw'}
          style={prefersReducedMotion ? undefined : { pathLength }}
        />
      </svg>
    </div>
  );
}
