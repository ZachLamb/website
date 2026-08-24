/**
 * Shared positioning for the trail through-line (TrailExtension) and its
 * waypoints (TrailWaypoints). One constant so the two can't drift apart.
 * Desktop: sits just left of the max-w-5xl (1024px) content column.
 * Mobile: hugs the viewport's left edge.
 *
 * `TRAIL_OFFSET_LEFT` is the raw desktop `left` calc() expression, with no
 * Tailwind class wrapper, so other absolutely-positioned elements that need
 * to align to the trail's horizontal position — e.g. the divider "crossing
 * dot" — can consume it directly instead of re-deriving the formula.
 * `TRAIL_GUTTER_CLASS` duplicates this same expression as a literal
 * `md:left-[...]` class string (see the comment above it for why it can't
 * just interpolate this constant).
 *
 * The line itself is drawn at the horizontal center of the gutter box (the
 * gutter is `w-5`/`md:w-6`; the SVG path sits at x=12 of a 0-24 viewBox, i.e.
 * exactly centered), so a consumer aligning to the *line* rather than the
 * gutter's left edge should add `TRAIL_LINE_CENTER_INSET`:
 * `calc(${TRAIL_OFFSET_LEFT} + ${TRAIL_LINE_CENTER_INSET})`.
 */
export const TRAIL_OFFSET_LEFT = 'max(0.5rem,calc((100vw-1024px)/2-2.5rem))';

/** Half the desktop gutter width (`md:w-6` = 1.5rem) — the line sits at the gutter's horizontal center. */
export const TRAIL_LINE_CENTER_INSET = '0.75rem';

/** Half the mobile gutter width (w-5 = 1.25rem) — the line sits at the mobile gutter's horizontal center. */
export const TRAIL_LINE_CENTER_INSET_MOBILE = '0.625rem';

// Tailwind v4 extracts class candidates as literal substrings of source files
// at build time — it never evaluates JS template literals or interpolates
// `TRAIL_OFFSET_LEFT` into this string. This MUST be a plain string literal
// containing the full, real class text so Tailwind's static scanner finds
// `md:left-[max(0.5rem,calc((100vw-1024px)/2-2.5rem))]` here, in this file.
// Keep the `md:left-[...]` value below in sync with `TRAIL_OFFSET_LEFT`
// by hand — the duplication is required, not accidental.
export const TRAIL_GUTTER_CLASS =
  'pointer-events-none fixed inset-y-0 left-0 z-30 w-5 md:left-[max(0.5rem,calc((100vw-1024px)/2-2.5rem))] md:w-6';

/** Numerals match the section kickers ("I · the trailhead" etc.). */
export const SECTION_NUMERALS: Record<string, string> = {
  about: 'I',
  experience: 'II',
  projects: 'IIb',
  endorsements: 'IIc',
  skills: 'III',
  services: 'IV',
  education: 'V',
  contact: 'VI',
};
