'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

export function About() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <Section variant="light" id="about" nature={{ leaves: true, birds: true }}>
      <AnimatedHeading sectionId="about" subtitle="I." className="mb-8">
        {messages.about.heading}
      </AnimatedHeading>

      <motion.p
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-bark max-w-3xl text-lg leading-relaxed"
      >
        {messages.about.body}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="text-stone mt-6 max-w-3xl text-sm"
        aria-label="Focus areas"
      >
        {messages.about.focusAreas}
      </motion.p>
    </Section>
  );
}
