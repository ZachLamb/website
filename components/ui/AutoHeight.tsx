'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';

interface AutoHeightProps {
  children: ReactNode;
  className?: string;
}

export function AutoHeight({ children, className }: AutoHeightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={className}
      style={{
        height: height !== undefined ? `${height}px` : 'auto',
        transition: height !== undefined ? 'height 300ms ease' : undefined,
        overflow: 'hidden',
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}
