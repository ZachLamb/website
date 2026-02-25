import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-bark/20 bg-sand px-2.5 py-0.5 text-xs text-bark transition-all hover:border-gold/40 hover:shadow-[0_0_8px_rgba(184,134,11,0.15)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
