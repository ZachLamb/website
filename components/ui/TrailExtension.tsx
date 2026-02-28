'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Vertical trail line that extends from the hero down the page and
 * "draws" as the user scrolls, communicating that they're following the path.
 */
export function TrailExtension() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(
    scrollYProgress,
    [0, 0.05, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0, 0.05, 0.5, 1],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 z-0 w-4 md:left-[max(0.5rem,calc((100vw-1280px)/2))] md:w-5"
    >
      <svg className="h-full w-full" viewBox="0 0 24 100" preserveAspectRatio="none">
        <motion.path
          d="M 12 0 L 12 100"
          fill="none"
          stroke="rgba(184,134,11,0.2)"
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
