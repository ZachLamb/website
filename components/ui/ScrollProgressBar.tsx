'use client';

import { useScrollProgress } from '@/hooks/useScrollProgress';

const ridgePath =
  'M0 14 L8 10 L16 13 L24 6 L32 11 L40 4 L50 9 L58 3 L66 8 L76 5 L84 10 L92 7 L100 3 L110 8 L118 5 L126 10 L134 3 L142 9 L150 6 L158 11 L166 4 L174 9 L182 7 L190 12 L200 10';

export function ScrollProgressBar() {
  useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-16 left-0 z-50 h-1.5 w-full"
    >
      <svg
        viewBox="0 0 200 18"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/* Track (unfilled ridge silhouette) */}
        <path
          d={ridgePath}
          fill="none"
          stroke="rgba(184,134,11,0.12)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Filled ridge — dashoffset driven by scroll progress */}
        <path
          d={ridgePath}
          fill="none"
          stroke="rgba(184,134,11,0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          style={{
            strokeDashoffset: 'calc(1 - var(--scroll-progress, 0))',
          } as React.CSSProperties}
        />
      </svg>
    </div>
  );
}
