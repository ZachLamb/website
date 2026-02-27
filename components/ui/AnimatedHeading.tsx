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
}

export function AnimatedHeading({
  children,
  as: tag = 'h2',
  className,
  subtitle,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const MotionTag = motionHeadings[tag];

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-stone flex items-center gap-2 text-sm tracking-[0.2em] uppercase"
        >
          <span className="bg-gold inline-block h-3 w-1.5 rounded-sm" aria-hidden="true" />
          {subtitle}
        </motion.p>
      )}
      <MotionTag
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: subtitle ? 0.1 : 0 }}
        className="text-forest font-serif text-3xl font-semibold md:text-4xl"
      >
        {children}
      </MotionTag>
    </div>
  );
}
