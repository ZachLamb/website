import { cn } from '@/lib/utils';
import { formatWaypoint } from '@/lib/waypoints';

interface SectionHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
  /** Waypoint number along the trail; matches the marker on the hero map. */
  number?: number;
  /** Short line above the title, e.g. "the trail log". */
  kicker?: string;
  /** When set, the title is an anchor to this section id (shareable link). */
  sectionId?: string;
  /** Set on the night surface. */
  onNight?: boolean;
}

/**
 * A section title as a map label: the numbered waypoint marker and kicker
 * on one line, the title beneath.
 */
export function SectionHeading({
  children,
  as: Tag = 'h2',
  className,
  number,
  kicker,
  sectionId,
  onNight = false,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {(number !== undefined || kicker) && (
        // aria-hidden: the kicker is flavour ("the trail log") and the number
        // repeats the reading order. The real title is the heading below.
        <p
          aria-hidden="true"
          className={cn(
            'flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase',
            onNight ? 'text-blaze-bright' : 'text-blaze',
          )}
        >
          {number !== undefined && number > 0 && (
            <span
              data-waypoint-number
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium tracking-normal',
                onNight ? 'bg-blaze-bright text-night' : 'bg-blaze text-paper',
              )}
            >
              {formatWaypoint(number)}
            </span>
          )}
          {kicker && <span className="min-w-0">{kicker}</span>}
          <span
            className={cn(
              'h-px w-10 shrink-0 border-t border-dashed',
              onNight ? 'border-blaze-bright/60' : 'border-blaze/60',
            )}
          />
        </p>
      )}
      <Tag
        id={sectionId ? `${sectionId}-heading` : undefined}
        className={cn(
          'mt-3 font-serif text-4xl leading-[1.05] font-semibold text-balance break-words sm:text-5xl',
          onNight ? 'text-paper' : 'text-ink',
        )}
      >
        {sectionId != null ? (
          <a
            href={`#${sectionId}`}
            className={cn(
              'rounded-sm no-underline transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              onNight
                ? 'hover:text-blaze-bright focus-visible:ring-blaze-bright focus-visible:ring-offset-night'
                : 'hover:text-blaze focus-visible:ring-blaze focus-visible:ring-offset-paper',
            )}
          >
            {children}
          </a>
        ) : (
          children
        )}
      </Tag>
    </div>
  );
}
