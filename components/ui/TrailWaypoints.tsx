'use client';

import { useEffect, useState, useRef } from 'react';
import { useActiveSection, SECTION_IDS } from '@/hooks/useActiveSection';
import { cn } from '@/lib/utils';

type WaypointPosition = { id: string; top: number };

const WAYPOINT_SECTIONS = SECTION_IDS.filter((id) => id !== 'hero');

export function TrailWaypoints() {
  const activeSection = useActiveSection();
  const [positions, setPositions] = useState<WaypointPosition[]>([]);
  const passedRef = useRef(new Set<string>());

  useEffect(() => {
    function measure() {
      const docHeight = document.documentElement.scrollHeight;
      const result: WaypointPosition[] = [];
      for (const id of WAYPOINT_SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          result.push({ id, top: el.offsetTop / docHeight });
        }
      }
      setPositions(result);
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const idx = SECTION_IDS.indexOf(activeSection as (typeof SECTION_IDS)[number]);
    if (idx >= 0) {
      for (let i = 0; i <= idx; i++) {
        passedRef.current.add(SECTION_IDS[i]);
      }
    }
  }, [activeSection]);

  if (positions.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-0 z-0 w-4 md:left-[max(0.5rem,calc((100vw-1280px)/2))] md:w-5"
    >
      {positions.map(({ id, top }) => {
        const isActive = activeSection === id;
        const isPassed = passedRef.current.has(id);

        return (
          <div
            key={id}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${top * 100}%` }}
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3">
              <circle
                cx="6"
                cy="6"
                r="5"
                fill={isActive ? 'var(--color-gold)' : isPassed ? 'rgba(184,134,11,0.5)' : 'none'}
                stroke={isActive ? 'var(--color-gold)' : 'rgba(184,134,11,0.3)'}
                strokeWidth="1.5"
                className={cn('transition-all duration-300')}
                style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(184,134,11,0.5))' } : undefined}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
