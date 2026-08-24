'use client';

import { useEffect, useState, useMemo } from 'react';
import { useActiveSection, SECTION_IDS } from '@/hooks/useActiveSection';
import { TRAIL_GUTTER_CLASS, SECTION_NUMERALS } from '@/lib/trail-position';
import { cn } from '@/lib/utils';

type WaypointPosition = { id: string; top: number };

const WAYPOINT_SECTIONS = SECTION_IDS.filter((id) => id !== 'hero');

export function TrailWaypoints() {
  const activeSection = useActiveSection();
  const [positions, setPositions] = useState<WaypointPosition[]>([]);

  const passedSections = useMemo(() => {
    const idx = SECTION_IDS.indexOf(activeSection as (typeof SECTION_IDS)[number]);
    const passed = new Set<string>();
    if (idx >= 0) {
      for (let i = 0; i <= idx; i++) {
        passed.add(SECTION_IDS[i]);
      }
    }
    return passed;
  }, [activeSection]);

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

  if (positions.length === 0) return null;

  return (
    <div aria-hidden="true" className={TRAIL_GUTTER_CLASS}>
      {positions.map(({ id, top }) => {
        const isActive = activeSection === id;
        const isPassed = passedSections.has(id);

        return (
          <div
            key={id}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${top * 100}%` }}
          >
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border font-serif text-[9px] font-semibold transition-all duration-300',
                isActive
                  ? 'border-gold bg-gold text-forest shadow-[0_0_6px_rgba(184,134,11,0.5)]'
                  : isPassed
                    ? 'border-gold/60 bg-gold/60 text-forest'
                    : 'border-gold/40 bg-parchment text-gold-deep',
              )}
            >
              {SECTION_NUMERALS[id] ?? ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}
