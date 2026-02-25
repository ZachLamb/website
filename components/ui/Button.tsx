import React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-gold text-parchment hover:bg-copper',
  secondary:
    'border border-gold text-gold hover:bg-gold/10',
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

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ children, variant = 'primary', className, href, ...props }, ref) => {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full px-6 py-3 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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
});

Button.displayName = 'Button';
