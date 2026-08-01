'use client';

import { m, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/Button';
import { MistLayer } from '@/components/ui/NatureElements';
import { TaglineCycler } from '@/components/ui/TaglineCycler';
import { socialLinks } from '@/data/social';
import { siteConfig } from '@/data/site';
import { demoTrip } from '@/data/trips';
import type { MarkerIcon } from '@/data/trips';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { socialIconMap } from '@/lib/icons';

// MotionConfig at the provider would already short-circuit transitions to
// instant on prefers-reduced-motion, but explicitly omitting
// initial/animate/transition on the trail-map's many SVG elements is defense
// in depth: it skips framer-motion's per-element animation setup entirely,
// removes any reliance on its pathLength reduce-motion semantics, and makes
// the static branch obvious in code review.

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/** Trail sign: post with horizontal bar and rectangular sign (trailhead style) */
function TrailSignPost() {
  return (
    <g stroke="currentColor" fill="none" strokeWidth="0.8" strokeLinejoin="round">
      <rect x="-4" y="-14" width="8" height="10" rx="0.5" fill="currentColor" fillOpacity="0.12" />
      <line x1="0" y1="-4" x2="0" y2="8" strokeWidth="1" />
      <line x1="-5" y1="2" x2="5" y2="2" strokeWidth="0.8" opacity="0.8" />
    </g>
  );
}

/** Trail sign: classic rectangular blaze */
function TrailSignBlaze() {
  return (
    <g stroke="currentColor" fill="currentColor" fillOpacity="0.15" strokeWidth="0.7">
      <rect x="-3" y="-10" width="6" height="14" rx="0.5" />
    </g>
  );
}

/** Trail sign: diamond (direction / waypoint) */
function TrailSignDiamond() {
  return (
    <g stroke="currentColor" fill="currentColor" fillOpacity="0.12" strokeWidth="0.8">
      <path d="M0 -12 L7 0 L0 12 L-7 0 Z" />
    </g>
  );
}

const markerIcons: Record<MarkerIcon, React.FC> = {
  peak: TrailSignPost,
  pine: TrailSignBlaze,
  compass: TrailSignPost,
  lake: TrailSignBlaze,
  campfire: TrailSignPost,
  elk: TrailSignDiamond,
  columbine: TrailSignDiamond,
  flag: TrailSignPost,
};

function MountainBackdrop({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  // When prefersReducedMotion is on, omit motion props so the paths render
  // statically at their end-state (opacity 1, y 0). Visual outcome matches
  // the post-animation state of the motion branch.
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0">
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: '180px' }}
      >
        {/* Far mountains */}
        <m.path
          d="M0 200 L0 120 L100 80 L200 110 L300 60 L400 100 L500 50 L600 90 L700 40 L800 85 L900 55 L1000 95 L1100 70 L1200 100 L1200 200Z"
          fill="rgba(245,240,232,0.06)"
          style={
            prefersReducedMotion
              ? undefined
              : { animation: 'mountain-sway-far 10s ease-in-out infinite' }
          }
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1.5, delay: 0.3 },
              })}
        />
        {/* Near mountains */}
        <m.path
          d="M0 200 L0 150 L80 120 L160 145 L260 100 L340 135 L450 90 L540 130 L650 105 L740 140 L840 110 L940 145 L1050 120 L1140 150 L1200 135 L1200 200Z"
          fill="rgba(245,240,232,0.10)"
          style={
            prefersReducedMotion
              ? undefined
              : { animation: 'mountain-sway-near 8s ease-in-out infinite' }
          }
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1.5, delay: 0.6 },
              })}
        />
        {/* Treeline silhouette */}
        <m.path
          d="M0 200 L0 170 L20 168 L35 155 L38 168 L55 150 L58 168 L75 158 L78 168 L95 145 L98 168 L120 160 L140 148 L143 168 L165 155 L168 168 L190 162 L210 142 L213 168 L240 158 L260 148 L263 168 L285 155 L305 140 L308 168 L330 160 L350 150 L353 168 L375 155 L395 145 L398 168 L420 160 L440 152 L443 168 L465 155 L485 142 L488 168 L510 158 L530 148 L533 168 L555 155 L575 140 L578 168 L600 162 L620 150 L623 168 L645 155 L665 145 L668 168 L690 160 L710 148 L713 168 L735 155 L755 142 L758 168 L780 160 L800 150 L803 168 L825 155 L845 145 L848 168 L870 160 L890 152 L893 168 L915 155 L935 142 L938 168 L960 158 L980 148 L983 168 L1005 155 L1025 140 L1028 168 L1050 162 L1070 150 L1073 168 L1095 155 L1115 145 L1118 168 L1140 160 L1160 152 L1163 168 L1185 158 L1200 165 L1200 200Z"
          fill="rgba(245,240,232,0.08)"
          style={
            prefersReducedMotion
              ? undefined
              : { animation: 'mountain-sway-tree 12s ease-in-out infinite' }
          }
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 1.2, delay: 0.9 },
              })}
        />
      </svg>
    </div>
  );
}

export function Hero() {
  const { locale, messages } = useLocaleContext();
  const basePath = `/${locale}`;
  // Drives the trail-map SVG: when true, every element below renders at its
  // animation end-state with no initial/animate/transition. See the doc comment
  // at the top of this file for why this is explicit instead of relying on
  // MotionConfig alone.
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="hero"
      className="bg-forest text-parchment relative flex min-h-[100dvh] min-h-screen flex-col items-center justify-center overflow-x-hidden"
    >
      {/* Background layer: clip decorations only so content is never clipped */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 800 750"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {/* Map frame – reads as a trail map */}
          <m.rect
            x="24"
            y="24"
            width="752"
            height="702"
            rx="8"
            fill="none"
            stroke="rgba(245,240,232,0.08)"
            strokeWidth="1.5"
            strokeDasharray="12 8"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 1.2, delay: 0.8 },
                })}
          />
          {/* Trail map label */}
          <m.g
            transform="translate(48, 52)"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: -4 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, delay: 1.2 },
                })}
          >
            <rect
              x="0"
              y="-6"
              width="88"
              height="20"
              rx="3"
              fill="rgba(245,240,232,0.06)"
              stroke="rgba(245,240,232,0.12)"
              strokeWidth="0.8"
            />
            <text
              x="44"
              y="6"
              textAnchor="middle"
              fill="rgba(245,240,232,0.5)"
              fontSize="9"
              fontFamily="var(--font-serif)"
              letterSpacing="0.15em"
            >
              TRAIL MAP
            </text>
            <path d="M68 0 L72 0 L70 -3 Z" fill="rgba(245,240,232,0.35)" />
          </m.g>
          <m.path
            d={demoTrip.trailPath}
            stroke="rgba(245,240,232,0.22)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
            fill="none"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { pathLength: 0 },
                  animate: { pathLength: 1 },
                  transition: { duration: 3.5, ease: 'easeInOut', delay: 0.5 },
                })}
          />

          {demoTrip.markers.map((marker) => {
            const Icon = markerIcons[marker.icon];
            return (
              <m.g
                key={`${marker.x}-${marker.y}`}
                transform={`translate(${marker.x}, ${marker.y})`}
                className="text-parchment/20"
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, scale: 0.4 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { duration: 0.6, delay: marker.delay, ease: 'easeOut' },
                    })}
              >
                <Icon />
                {marker.label && (
                  <text
                    y={20}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="9"
                    fontFamily="var(--font-serif)"
                    letterSpacing="0.05em"
                    opacity="0.85"
                  >
                    {marker.label}
                  </text>
                )}
              </m.g>
            );
          })}

          {/* Elevation contour hints */}
          {/* Contour group A — upper right */}
          <g
            style={
              prefersReducedMotion
                ? undefined
                : { animation: 'contour-drift-a 15s ease-in-out infinite' }
            }
          >
            <ellipse
              cx="560"
              cy="140"
              rx="90"
              ry="45"
              fill="none"
              stroke="rgba(245,240,232,0.12)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="560"
              cy="140"
              rx="65"
              ry="32"
              fill="none"
              stroke="rgba(245,240,232,0.10)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="560"
              cy="140"
              rx="40"
              ry="20"
              fill="none"
              stroke="rgba(245,240,232,0.08)"
              strokeWidth="0.8"
            />
          </g>

          {/* Contour group B — lower left */}
          <g
            style={
              prefersReducedMotion
                ? undefined
                : { animation: 'contour-drift-b 18s ease-in-out infinite' }
            }
          >
            <ellipse
              cx="200"
              cy="420"
              rx="70"
              ry="35"
              fill="none"
              stroke="rgba(245,240,232,0.10)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="200"
              cy="420"
              rx="50"
              ry="25"
              fill="none"
              stroke="rgba(245,240,232,0.08)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="200"
              cy="420"
              rx="30"
              ry="15"
              fill="none"
              stroke="rgba(245,240,232,0.06)"
              strokeWidth="0.8"
            />
          </g>

          {/* Contour group C — center */}
          <g
            style={
              prefersReducedMotion
                ? undefined
                : { animation: 'contour-drift-c 20s ease-in-out infinite' }
            }
          >
            <ellipse
              cx="470"
              cy="350"
              rx="60"
              ry="30"
              fill="none"
              stroke="rgba(245,240,232,0.10)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="470"
              cy="350"
              rx="38"
              ry="18"
              fill="none"
              stroke="rgba(245,240,232,0.08)"
              strokeWidth="0.8"
            />
          </g>

          {/* Contour group D — upper left */}
          <g
            style={
              prefersReducedMotion
                ? undefined
                : { animation: 'contour-drift-a 14s ease-in-out infinite 3s' }
            }
          >
            <ellipse
              cx="130"
              cy="180"
              rx="55"
              ry="28"
              fill="none"
              stroke="rgba(245,240,232,0.08)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="130"
              cy="180"
              rx="35"
              ry="18"
              fill="none"
              stroke="rgba(245,240,232,0.06)"
              strokeWidth="0.8"
            />
          </g>

          {/* Secondary trail paths (dotted, decoration) */}
          {(demoTrip.secondaryTrailPaths ?? []).map((pathD, i) => (
            <m.path
              key={i}
              d={pathD}
              stroke="rgba(245,240,232,0.07)"
              strokeWidth="1.5"
              strokeDasharray={i === 0 ? '4 8' : '6 6'}
              strokeLinecap="round"
              fill="none"
              {...(prefersReducedMotion
                ? {}
                : {
                    initial: { pathLength: 0 },
                    animate: { pathLength: 1 },
                    transition: {
                      duration: i === 0 ? 4 : 3.8,
                      ease: 'easeInOut',
                      delay: i === 0 ? 1.2 : 1.8,
                    },
                  })}
            />
          ))}
          {/* Trail continues down off the map — follow the path.
              L2 timing tighten: was delay 4s (extended the longest tail of
              the trail-map timeline to 5.2s end-time). 2.5s overlaps the
              tail of the main trail's draw (which ends at 4s), so trail-
              continues finishes at 3.3s — the visual narrative still
              reads "main trail draws, line continues off the map" because
              the tail-end of both animations runs concurrently rather
              than sequentially. End-state visual is unchanged. */}
          <m.path
            d="M 220 660 L 220 760"
            stroke="rgba(245,240,232,0.12)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            fill="none"
            {...(prefersReducedMotion
              ? {}
              : {
                  initial: { pathLength: 0 },
                  animate: { pathLength: 1 },
                  transition: { duration: 1.2, ease: 'easeOut', delay: 2.5 },
                })}
          />
        </svg>
        <MountainBackdrop prefersReducedMotion={prefersReducedMotion} />
        <MistLayer />
      </div>

      {/* Transition ridge into next section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <svg
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: '40px' }}
        >
          <path
            d="M0 40 L0 30 L80 18 L160 28 L260 10 L340 22 L440 8 L540 20 L640 12 L740 25 L840 15 L940 28 L1040 10 L1120 22 L1200 18 L1200 40Z"
            fill="var(--color-parchment)"
          />
        </svg>
      </div>

      <m.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6 md:px-8"
      >
        <m.p
          variants={fadeUp}
          className="text-gold text-center font-sans text-sm tracking-widest break-words uppercase"
        >
          {messages.hero.subtitle}
        </m.p>

        {siteConfig.availability && (
          <m.span
            variants={fadeUp}
            className="border-gold/40 bg-gold/10 text-gold mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium tracking-wide"
          >
            {siteConfig.availability}
          </m.span>
        )}

        <m.h1
          variants={fadeUp}
          className="text-parchment mt-4 text-center font-serif text-6xl font-bold break-words md:text-8xl"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          {messages.hero.title}
        </m.h1>

        <m.div variants={fadeUp} className="mt-6 w-full max-w-2xl">
          <TaglineCycler
            taglines={messages.hero.taglines}
            // Default 6s; explicit here so the value is co-located with the
            // taglines content and easy to tune per-site if needed.
            intervalMs={6000}
            // Reserve enough vertical space for the tallest variant so the
            // CTA buttons below don't shift when the cycler rotates between
            // 1, 2, and 3-line wrappings. ~3 lines @ 360px (mobile),
            // ~2 lines @ ≥768px.
            className="text-stone text-center text-lg break-words md:text-xl"
          />
        </m.div>

        <m.div
          variants={fadeUp}
          className="mt-8 flex w-full min-w-0 flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
        >
          <Button href={`${basePath}#contact`} className="w-full sm:w-auto sm:min-w-0">
            {messages.hero.getInTouch}
          </Button>
          <Button
            variant="secondary"
            href={`${basePath}#about`}
            className="w-full sm:w-auto sm:min-w-0"
          >
            {messages.hero.learnMore}
          </Button>
        </m.div>

        <m.div
          variants={fadeUp}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {siteConfig.links.resume && (
            <a
              href={siteConfig.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone hover:text-gold focus-visible:ring-gold decoration-gold/30 hover:decoration-gold rounded text-sm font-medium underline underline-offset-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label={messages.hero.viewResume}
            >
              {messages.hero.resume}
            </a>
          )}
          <span className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = socialIconMap[link.icon];
              if (!Icon) return null;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.platform} (opens in new tab)`}
                  className={cn(
                    'text-stone hover:text-gold focus-visible:ring-gold flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    link.icon === 'linkedin' && 'hover:shadow-[0_0_12px_rgba(184,134,11,0.3)]',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </span>
        </m.div>
      </m.div>
    </section>
  );
}
