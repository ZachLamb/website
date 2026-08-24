import type { Variants } from 'framer-motion';

/**
 * Never-blank rule (Field Journal spec §1.2): entrance animations use
 * offsets ≤ 12px and durations ≤ 0.35s so content is legible almost
 * immediately when it enters the viewport. Scroll-linked ambience (trail
 * line, parallax) carries the craft; entrances stay out of the way.
 */

export const trailFadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export const waypointPop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 24 },
  },
};

/** Legacy names kept for call-site stability — now small-offset fades. */
export const elevationSlideLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
};

export const elevationSlideRight: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35 },
  },
};
