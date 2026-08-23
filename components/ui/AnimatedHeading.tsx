'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

// With LazyMotion + m.*, we use the per-tag components directly instead of
// m.create('h1'). These are structurally identical (same API, same
// runtime behavior) but share the lazy-loaded feature bundle.
const motionHeadings = {
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
} as const;

interface AnimatedHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  subtitle?: string;
  /** When set, the heading becomes a link to this section id (e.g. "about") for shareable anchors */
  sectionId?: string;
}

function LeafAccent() {
  return (
    <m.svg
      viewBox="0 0 12 16"
      className="text-gold inline-block h-3.5 w-3.5"
      aria-hidden="true"
      initial={{ opacity: 0, y: -12, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
    >
      <path
        d="M6 0 C9 3 11 7 10 12 C8 15 6 16 6 16 C6 16 4 15 2 12 C1 7 3 3 6 0Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path d="M6 3 L6 14" stroke="currentColor" strokeWidth="0.3" opacity="0.4" fill="none" />
    </m.svg>
  );
}

export function AnimatedHeading({
  children,
  as: tag = 'h2',
  className,
  subtitle,
  sectionId,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const MotionTag = motionHeadings[tag];
  const headingContent =
    sectionId != null ? (
      <a
        href={`#${sectionId}`}
        className="hover:text-gold focus-visible:ring-gold inline-block rounded no-underline transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {children}
      </a>
    ) : (
      children
    );

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {subtitle && (
        // aria-hidden: subtitle is a decorative section marker (e.g. "I.", "IIb.").
        // Screen readers announce these as ambiguous text ("I dot, II b dot…").
        // The real semantic title sits in the <MotionTag> below.
        <m.p
          aria-hidden="true"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-gold-deep flex items-center gap-2 font-serif text-sm tracking-[0.2em] italic"
        >
          <LeafAccent />
          {subtitle}
        </m.p>
      )}
      <MotionTag
        id={sectionId ? `${sectionId}-heading` : undefined}
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.35, delay: subtitle ? 0.05 : 0 }}
        className="text-forest font-serif text-4xl font-semibold break-words md:text-5xl"
      >
        {headingContent}
      </MotionTag>
      <m.div
        aria-hidden="true"
        className="mt-1 h-px overflow-hidden"
        initial={{ width: 0 }}
        animate={isInView ? { width: '6rem' } : { width: 0 }}
        transition={{ duration: 0.4, delay: subtitle ? 0.25 : 0.15, ease: 'easeOut' }}
      >
        <div className="bg-gold/30 h-full w-full" />
      </m.div>
    </div>
  );
}
