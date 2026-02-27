import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'border-bark/20 bg-sand text-bark hover:border-gold/40 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-all hover:shadow-[0_0_8px_rgba(184,134,11,0.15)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
