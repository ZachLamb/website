import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'border-contour/40 bg-paper text-ink-soft inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs',
        className,
      )}
    >
      {children}
    </span>
  );
}
