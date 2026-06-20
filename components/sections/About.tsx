'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';

export function About() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const firstParagraph = messages.about.body[0] ?? '';
  const remainingParagraphs = messages.about.body.slice(1);
  const focusAreas = messages.about.focusAreas.split(' · ').filter(Boolean);

  return (
    <Section variant="light" id="about" nature={{ leaves: true, birds: true }}>
      <AnimatedHeading sectionId="about" subtitle="I." className="mb-8">
        {messages.about.heading}
      </AnimatedHeading>

      {/* Pull-quote: first paragraph at display size with gold left accent */}
      <m.p
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-bark border-gold max-w-3xl border-l-2 pl-4 text-xl leading-relaxed break-words md:text-2xl"
      >
        {firstParagraph}
      </m.p>

      {remainingParagraphs.map((paragraph, i) => (
        <m.p
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.35 + i * 0.15 }}
          className="text-bark mt-4 max-w-3xl text-lg leading-relaxed break-words"
        >
          {paragraph}
        </m.p>
      ))}

      {/* Focus area pills */}
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.45 }}
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
    </Section>
  );
}
