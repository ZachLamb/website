import { cn } from '@/lib/utils';

interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'children'> {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'li' | 'figure';
  /** Set on the night surface. */
  onNight?: boolean;
}

/**
 * A map plate: the raised, ruled panel every boxed piece of content sits on.
 * Square-shouldered and flat on purpose — it is printed on the sheet, not
 * floating above it, so it has no hover state of its own.
 */
export function Card({
  children,
  className,
  as: Tag = 'div',
  onNight = false,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-md border',
        onNight
          ? 'border-paper/15 bg-night-raised'
          : 'border-contour/40 bg-paper-raised shadow-[0_1px_0_rgba(168,116,58,0.22)]',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
