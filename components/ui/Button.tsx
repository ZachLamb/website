import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  // charcoal-on-gold-light clears WCAG AA (6.5:1); the original
  // parchment-on-gold combination read at only ~2.9:1. Hover uses the base
  // gold shade (still 4.4:1 with charcoal text) instead of copper, which
  // drops below AA against charcoal.
  primary: 'bg-gold-light text-charcoal hover:bg-gold',
  secondary: 'border border-gold-light text-gold-light hover:bg-gold-light/10',
} as const;

type ButtonProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  href?: string;
} & (
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | React.ButtonHTMLAttributes<HTMLButtonElement>
);

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, variant = 'primary', className, href, ...props }, ref) => {
    const classes = cn(
      'inline-flex min-h-11 min-w-[44px] items-center justify-center rounded-full px-6 py-3 font-medium transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variants[variant],
      className,
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
