'use client';

import { useEffect, useState } from 'react';

const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'endorsements',
  'skills',
  'services',
  'education',
  'contact',
];

/**
 * Returns the id of the section currently in view (based on scroll position).
 * Used for active nav state and aria-current.
 */
export function useActiveSection(): string {
  const [active, setActive] = useState<string>('hero');

  useEffect(() => {
    function updateActive() {
      const scrollY = window.scrollY;
      const viewportMid = scrollY + window.innerHeight * 0.35;
      let current = 'hero';

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const id = SECTION_IDS[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (viewportMid >= top && viewportMid < top + height) {
            current = id;
            break;
          }
          if (viewportMid < top) current = id;
        }
      }

      setActive((prev) => (prev !== current ? current : prev));
    }

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, []);

  return active;
}
