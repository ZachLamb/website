'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <Section variant="light" id="about">
      <AnimatedHeading subtitle="I." className="mb-8">
        Trail Guide
      </AnimatedHeading>

      <motion.p
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl text-lg leading-relaxed text-bark"
      >
        I&rsquo;m a frontend-leaning full-stack engineer with over a decade of
        experience building web applications that people actually enjoy using.
        Currently, I&rsquo;m at Circadence crafting AI-powered tools for
        cybersecurity professionals. Before that, I helped Starbucks store teams
        communicate better and built design systems at StellarFi. I&rsquo;m a
        Certified ScrumMaster who believes great software comes from great
        processes and empathetic teams. When I&rsquo;m not writing code,
        you&rsquo;ll find me teaching yoga, exploring Colorado&rsquo;s trails,
        lifting weights, or debating the best Oreo flavor.
      </motion.p>
    </Section>
  );
}
