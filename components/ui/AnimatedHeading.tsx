'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

const MotionH1 = motion.create('h1');
const MotionH2 = motion.create('h2');
const MotionH3 = motion.create('h3');

const motionHeadings = {
  h1: MotionH1,
  h2: MotionH2,
  h3: MotionH3,
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
    <motion.svg
      viewBox="0 0 12 16"
      className="text-gold inline-block h-3.5 w-3.5"
      aria-hidden="true"
      initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <path
        d="M6 0 C9 3 11 7 10 12 C8 15 6 16 6 16 C6 16 4 15 2 12 C1 7 3 3 6 0Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path d="M6 3 L6 14" stroke="currentColor" strokeWidth="0.3" opacity="0.4" fill="none" />
    </motion.svg>
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
        className="hover:text-gold focus:ring-gold inline-block rounded no-underline transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        {children}
      </a>
    ) : (
      children
    );

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-stone flex items-center gap-2 text-sm tracking-[0.2em] uppercase"
        >
          <LeafAccent />
          {subtitle}
        </motion.p>
      )}
      <MotionTag
        id={sectionId ? `${sectionId}-heading` : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: subtitle ? 0.1 : 0 }}
        className="text-forest font-serif text-3xl font-semibold md:text-4xl"
      >
        {headingContent}
      </MotionTag>
    </div>
  );
}
