import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Trail-map style: dashed boundary (map area) */
  variant?: 'default' | 'map';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'border-bark/10 bg-sand/40 hover:border-gold/30 rounded-lg border p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_4px_24px_rgba(107,127,94,0.12),0_1px_8px_rgba(184,134,11,0.08)]',
        variant === 'map' && 'border-bark/20 border-dashed',
        className,
      )}
    >
      {children}
    </div>
  );
}
