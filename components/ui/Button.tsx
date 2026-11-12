import React from 'react';
import { cn } from '@/lib/utils';

// Every pairing clears WCAG AA: paper on blaze is 5.4:1, night on
// blaze-bright 5.3:1. Hover moves to ink / paper rather than a lighter
// blaze, which would drop below AA.
const variants = {
  primary: {
    paper: 'bg-blaze text-paper hover:bg-ink',
    night: 'bg-blaze-bright text-night hover:bg-paper',
  },
  secondary: {
    paper: 'border border-ink/70 text-ink hover:border-blaze hover:text-blaze',
    night: 'border border-paper/60 text-paper hover:border-blaze-bright hover:text-blaze-bright',
  },
} as const;

type ButtonProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  /** Set when the button sits on the night surface. */
  onNight?: boolean;
  className?: string;
  href?: string;
} & (
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | React.ButtonHTMLAttributes<HTMLButtonElement>
);

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, variant = 'primary', onNight = false, className, href, ...props }, ref) => {
    const classes = cn(
      'inline-flex min-h-12 min-w-[44px] touch-manipulation items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      onNight
        ? 'focus-visible:ring-blaze-bright focus-visible:ring-offset-night'
        : 'focus-visible:ring-blaze focus-visible:ring-offset-paper',
      variants[variant][onNight ? 'night' : 'paper'],
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
