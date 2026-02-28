'use client';

import { cn } from '@/lib/utils';
import { FloatingLeaves, Fireflies, PineTreeSilhouette, BirdSilhouettes } from './NatureElements';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
  nature?: {
    leaves?: boolean;
    fireflies?: boolean;
    pines?: boolean;
    birds?: boolean;
  };
}

export function Section({ id, children, className, variant = 'light', nature }: SectionProps) {
  const showLeaves = nature?.leaves ?? variant === 'light';
  const showFireflies = nature?.fireflies ?? variant === 'dark';
  const showPines = nature?.pines ?? false;
  const showBirds = nature?.birds ?? false;

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={cn(
        'relative overflow-hidden py-16 md:py-24',
        variant === 'dark' ? 'bg-charcoal text-parchment' : 'bg-parchment',
        className,
      )}
    >
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

      <div className="relative z-10 mx-auto max-w-5xl min-w-0 px-4 sm:px-6">{children}</div>
    </section>
  );
}
