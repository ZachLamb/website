'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

export function About() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const pullQuote = messages.about.body[0] ?? '';
  const focusAreas = messages.about.focusAreas.split(' · ').filter(Boolean);

  return (
    <Section variant="light" id="about" nature={{ leaves: true, birds: true }}>
      <AnimatedHeading sectionId="about" subtitle="I." className="mb-8">
        {messages.about.heading}
      </AnimatedHeading>

      <div ref={ref}>
        {/* Pull-quote: sentence 1 at display size with gold left accent */}
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-bark border-gold max-w-3xl border-l-2 pl-4 text-xl leading-relaxed break-words md:text-2xl"
        >
          {pullQuote}
        </m.p>

        {/* Stats grid */}
        <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {messages.about.stats.map((stat, i) => (
            <m.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="border-gold/30 rounded-lg border border-dashed px-4 py-3 text-center"
            >
              <div className="text-gold font-serif text-3xl font-bold">{stat.value}</div>
              <div className="text-stone mt-1 text-xs">{stat.label}</div>
            </m.div>
          ))}
        </div>

        {/* Personal closer */}
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-bark mt-6 max-w-3xl text-sm italic"
        >
          {messages.about.personalNote}
        </m.p>

        {/* Focus area pills */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 flex max-w-3xl flex-wrap gap-2"
        >
          {focusAreas.map((area) => (
            <span
              key={area}
              className="border-bark/20 bg-sand text-bark inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs"
            >
              {area}
            </span>
          ))}
        </m.div>
      </div>
    </Section>
  );
}
