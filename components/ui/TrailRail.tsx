'use client';

import { cn } from '@/lib/utils';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { formatWaypoint, waypoints } from '@/lib/waypoints';

/**
 * The trail as a side rail: one numbered waypoint per section, filled in as
 * the reader passes it. Shown only where the page has a spare gutter (xl
 * and up); phones and tablets get the progress line in the header instead,
 * so nothing is ever laid over the content.
 *
 * Pointer-only shortcut: every destination is already in the main nav, so
 * the rail is hidden from assistive tech and the tab order rather than
 * announcing the same seven links twice.
 */
export function TrailRail() {
  const { messages } = useLocaleContext();
  const active = useActiveSection();
  const activeIndex = waypoints.findIndex((w) => w.id === active);

  return (
    <div
      aria-hidden="true"
      data-print-hidden
      data-trail-rail
      className={cn(
        'fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 transition-opacity duration-300 xl:block',
        // Out of the way over the hero, which has its own map of the trail.
        activeIndex < 0 && 'pointer-events-none opacity-0',
      )}
    >
      <ol className="relative flex flex-col gap-3">
        <li
          className="border-blaze/50 absolute top-3 bottom-3 left-1/2 -translate-x-1/2 border-l border-dashed"
          role="presentation"
        />
        {waypoints.map((item, i) => {
          const state = i === activeIndex ? 'here' : i < activeIndex ? 'passed' : 'ahead';
          return (
            <li key={item.id} className="relative">
              <a
                href={item.href}
                tabIndex={-1}
                title={messages.nav[item.key]}
                data-state={state}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[10px] font-medium transition-colors duration-300',
                  state === 'here' &&
                    'border-blaze bg-blaze text-paper animate-[here-pulse_1.6s_ease-out_infinite]',
                  state === 'passed' && 'border-blaze bg-paper text-blaze',
                  state === 'ahead' &&
                    'border-contour/60 bg-paper text-ink-soft hover:border-blaze hover:text-blaze',
                )}
              >
                {formatWaypoint(i + 1)}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
