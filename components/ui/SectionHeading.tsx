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
            'font-display flex items-center gap-3 text-base font-extrabold tracking-[0.18em] uppercase sm:text-lg',
            onNight ? 'text-blaze-bright' : 'text-blaze',
          )}
        >
          {number !== undefined && number > 0 && (
            <span
              data-waypoint-number
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-black tracking-normal',
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
          'font-display mt-2 text-6xl leading-[0.88] font-black tracking-tight text-balance break-words uppercase sm:text-7xl lg:text-8xl',
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
