import { cn } from '@/lib/utils';
import { formatWaypoint } from '@/lib/waypoints';
import {
  LAKE,
  MAP_HEIGHT,
  MAP_WIDTH,
  SUMMIT,
  WEST_PEAK,
  routePath,
  waypointsAlongRoute,
} from '@/lib/trail-route';

export interface TrailMapStop {
  id: string;
  href: string;
  label: string;
}

interface TrailMapProps {
  /** One stop per page section, in order: trailhead first, summit last. */
  stops: readonly TrailMapStop[];
  title: string;
  /** Accessible name for the list of section links under the map. */
  legendLabel: string;
  className?: string;
}

const pct = (value: number, of: number) => `${(value / of) * 100}%`;

/** Seconds: the route takes this long to draw, after this delay. */
const DRAW_DELAY = 0.35;
const DRAW_DURATION = 1.8;

/**
 * The hero's map plate. The page itself is the hike: each section is a
 * numbered waypoint on the route, and the same numbers head the sections
 * below.
 *
 * Built in layers so it stays sharp and legible at any width: the terrain
 * is a static SVG image (public/topo/hero-map.svg), the route is an inline
 * SVG whose stroke does not scale, and the markers and place names are
 * HTML positioned by percentage, so they keep their pixel size — and their
 * tap target — on a phone.
 */
export function TrailMap({ stops, title, legendLabel, className }: TrailMapProps) {
  const points = waypointsAlongRoute(stops.length);

  return (
    <figure
      className={cn(
        'border-ink/70 bg-paper-raised overflow-hidden rounded-md border shadow-[4px_4px_0_rgba(31,42,34,0.12)]',
        className,
      )}
    >
      {/* Sheet title strip */}
      <div className="border-ink/70 text-ink flex items-center justify-between gap-3 border-b px-3 py-2 font-mono text-[10px] tracking-[0.16em] uppercase sm:text-[11px]">
        <span className="font-medium">{title}</span>
        <span aria-hidden="true" className="text-ink-soft whitespace-nowrap">
          40°15′N 105°37′W
        </span>
      </div>

      <div
        aria-hidden="true"
        className="relative aspect-[4/3] bg-[#dde6c8] bg-cover bg-center"
        style={{ backgroundImage: "url('/topo/hero-map.svg')" }}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <mask
            id="route-reveal"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
          >
            <path
              d={routePath}
              pathLength={1}
              stroke="white"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="1"
              style={{
                animation: `route-draw ${DRAW_DURATION}s ease-in-out ${DRAW_DELAY}s both`,
              }}
            />
          </mask>
          <g mask="url(#route-reveal)">
            {/* Paper casing under the dashes keeps the route readable where
                it crosses contour lines. */}
            <path
              d={routePath}
              stroke="var(--color-paper-raised)"
              strokeOpacity="0.85"
              strokeWidth="6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={routePath}
              stroke="var(--color-blaze)"
              strokeWidth="2.5"
              strokeDasharray="7 5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>

        {/* Place names. Fixed pixel sizes: these must not shrink with the map. */}
        <span
          className="text-ink absolute -translate-x-1/2 font-mono text-[9px] leading-tight tracking-wider whitespace-nowrap uppercase sm:text-[10px]"
          style={{ left: pct(SUMMIT[0], MAP_WIDTH), top: pct(SUMMIT[1] - 78, MAP_HEIGHT) }}
        >
          Longs Peak · 14,259′
        </span>
        <span
          className="text-water absolute -translate-x-1/2 -translate-y-1/2 font-serif text-xs italic sm:text-sm"
          style={{ left: pct(LAKE[0], MAP_WIDTH), top: pct(LAKE[1], MAP_HEIGHT) }}
        >
          Bear Lake
        </span>
        <span
          className="text-ink-soft absolute hidden -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] tracking-wider whitespace-nowrap uppercase sm:block"
          style={{ left: pct(WEST_PEAK[0], MAP_WIDTH), top: pct(WEST_PEAK[1], MAP_HEIGHT) }}
        >
          ▲ 12,324′
        </span>

        {/* North arrow */}
        <div className="text-ink absolute top-3 left-3 flex flex-col items-center font-mono text-[10px] leading-none font-medium">
          N
          <svg viewBox="0 0 12 22" className="mt-1 h-5 w-3" fill="none" stroke="currentColor">
            <path d="M6 21V2M6 1L2 8M6 1l4 7" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Scale bar */}
        <div className="text-ink absolute right-3 bottom-2.5 font-mono text-[9px] leading-none sm:text-[10px]">
          <div className="border-ink flex h-1.5 w-20 border">
            <span className="bg-ink w-1/4" />
            <span className="w-1/4" />
            <span className="bg-ink w-1/4" />
          </div>
          <div className="mt-1 flex w-20 justify-between">
            <span>0</span>
            <span>1 mi</span>
          </div>
        </div>

        {/* Waypoint markers. The legend below carries the same links with
            their names, so these are a pointer/touch shortcut only. */}
        {stops.map((stop, i) => (
          <a
            key={stop.id}
            href={stop.href}
            tabIndex={-1}
            data-map-marker={stop.id}
            className="bg-blaze text-paper ring-paper-raised hover:bg-ink absolute flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-medium ring-2 transition-colors before:absolute before:-inset-2 before:content-['']"
            style={{
              left: `${points[i].left}%`,
              top: `${points[i].top}%`,
              translate: '-50% -50%',
              animation: `marker-pop 0.35s cubic-bezier(0.3, 1.4, 0.5, 1) ${
                DRAW_DELAY + points[i].progress * DRAW_DURATION
              }s both`,
            }}
          >
            {formatWaypoint(i + 1)}
          </a>
        ))}
      </div>

      {/* Legend: the real, named links. */}
      <figcaption className="border-ink/70 border-t">
        <ol
          aria-label={legendLabel}
          // One column on the narrowest phones: at 320px two columns leave too
          // little room for long labels ("Qualifikationen") to stay on a line.
          className="grid grid-cols-1 gap-x-2 px-2 py-1.5 min-[360px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-2"
        >
          {stops.map((stop, i) => (
            <li key={stop.id} className="min-w-0">
              <a
                href={stop.href}
                className="group text-ink focus-visible:ring-blaze flex min-h-12 items-center gap-2.5 rounded-sm px-1.5 py-1 text-sm leading-tight focus-visible:ring-2 focus-visible:outline-none"
              >
                <span
                  aria-hidden="true"
                  className="border-blaze text-blaze group-hover:bg-blaze group-hover:text-paper flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-medium transition-colors"
                >
                  {formatWaypoint(i + 1)}
                </span>
                <span className="group-hover:text-blaze min-w-0 break-words transition-colors">
                  {stop.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
