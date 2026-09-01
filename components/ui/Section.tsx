'use client';

import { cn } from '@/lib/utils';
import { FloatingLeaves, Fireflies, PineTreeSilhouette, BirdSilhouettes } from './NatureElements';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  /** Tonal variation for light sections. Dark sections ignore this prop. */
  tone?: 'warm' | 'cool' | 'dusk';
  /** Trail-map style framing: thin top/bottom rules */
  mapFrame?: boolean;
  nature?: {
    leaves?: boolean;
    fireflies?: boolean;
    pines?: boolean;
    birds?: boolean;
  };
  /**
   * Decorative content rendered at the section's full width/height, behind
   * the content column and outside its max-w-5xl clip — for background
   * flourishes (watermarks, elevation profiles) that should fill the
   * section's true dead space rather than being boxed into the content
   * column's own bounds.
   */
  decoration?: React.ReactNode;
}

export function Section({
  id,
  children,
  className,
  variant = 'light',
  tone,
  mapFrame,
  nature,
  decoration,
}: SectionProps) {
  const showLeaves = nature?.leaves ?? variant === 'light';
  const showFireflies = nature?.fireflies ?? variant === 'dark';
  const showPines = nature?.pines ?? false;
  const showBirds = nature?.birds ?? false;

  return (
    <section
      id={id}
      // tabIndex=-1 makes the section programmatically focusable so hash-jump
      // navigation (e.g. #projects) can move keyboard focus to the landmark.
      // Without this, screen-reader/keyboard users scroll but stay tabbed
      // wherever they were, losing place.
      tabIndex={-1}
      aria-labelledby={id ? `${id}-heading` : undefined}
      data-map-frame={mapFrame ?? undefined}
      className={cn(
        'relative overflow-hidden py-12 sm:py-16 md:py-24',
        // Suppress the focus ring that tabIndex=-1 would otherwise paint when
        // we programmatically move focus here — it's not a tabstop, it's an
        // anchor target. Outline:none is fine here because real focusable
        // children inside the section keep their own visible focus styles.
        'focus:outline-none',
        variant === 'dark'
          ? 'bg-charcoal text-parchment'
          : tone === 'cool'
            ? 'bg-parchment-cool'
            : tone === 'dusk'
              ? 'bg-parchment-warm'
              : 'bg-parchment',
        mapFrame && 'border-bark/10 border-t border-b',
        className,
      )}
    >
      {/* Decorative elements hidden on mobile; visible on tablet+ */}
      <div className="hidden md:block">
        {showLeaves && (
          <FloatingLeaves
            count={6}
            color={variant === 'dark' ? 'text-moss/10' : 'text-moss/15'}
            seed={id ? id.charCodeAt(0) * 7 : 42}
          />
        )}
        {showFireflies && <Fireflies count={10} />}
        {showPines && (
          <>
            <PineTreeSilhouette position="left" />
            <PineTreeSilhouette position="right" />
          </>
        )}
        {showBirds && <BirdSilhouettes count={2} />}
      </div>
      {decoration}

      <div className="relative z-10 mx-auto max-w-5xl min-w-0 px-4 sm:px-6">{children}</div>
    </section>
  );
}
