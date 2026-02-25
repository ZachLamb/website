import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-bark/10 bg-sand/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[0_2px_20px_rgba(184,134,11,0.12)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
