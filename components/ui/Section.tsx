import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

export function Section({ id, children, className, variant = 'light' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24',
        variant === 'dark' ? 'bg-charcoal text-parchment' : 'bg-parchment',
        className,
      )}
    >
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}
