import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Trail-map styles:
   * - map: dashed boundary (map area)
   * - plate: map-plate — lighter fill, bark border, gold corner tick
   */
  variant?: 'default' | 'map' | 'plate';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'group/card border-bark/10 bg-sand/40 hover:border-gold/30 relative rounded-lg border p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(107,127,94,0.12),0_1px_8px_rgba(184,134,11,0.08)]',
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:opacity-0 after:transition-opacity after:content-[''] hover:after:animate-[topo-pulse_0.6s_ease-out]",
        variant === 'map' && 'border-bark/20 border-dashed',
        variant === 'plate' &&
          'border-bark/15 before:bg-gold bg-white/40 before:absolute before:top-0 before:left-4 before:h-0.5 before:w-6 before:content-[""]',
        className,
      )}
    >
      {children}
    </div>
  );
}
