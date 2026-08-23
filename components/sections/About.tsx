'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { waypointPop } from '@/lib/trail-animations';

export function About() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const pullQuote = messages.about.body[0] ?? '';
  const focusAreas = messages.about.focusAreas.split(' · ').filter(Boolean);

  return (
    <Section variant="light" id="about" nature={{ leaves: true, birds: true }} className="md:pb-16">
      <AnimatedHeading
        sectionId="about"
        subtitle={`I · ${messages.kickers.about}`}
        className="mb-8"
      >
        {messages.about.heading}
      </AnimatedHeading>

      {/* Compass-rose watermark fills the right-side dead space (desktop only) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className="text-bark pointer-events-none absolute top-24 right-8 hidden h-52 w-52 opacity-[0.06] lg:block"
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 6 L54 46 L50 42 L46 46 Z" fill="currentColor" />
        <path d="M50 94 L54 54 L50 58 L46 54 Z" fill="currentColor" opacity="0.5" />
        <path d="M6 50 L46 46 L42 50 L46 54 Z" fill="currentColor" opacity="0.5" />
        <path d="M94 50 L54 46 L58 50 L54 54 Z" fill="currentColor" opacity="0.5" />
        <text
          x="50"
          y="16"
          textAnchor="middle"
          fontSize="8"
          fill="currentColor"
          fontFamily="var(--font-serif)"
        >
          N
        </text>
      </svg>

      <div ref={ref}>
        {/* Pull-quote: sentence 1 at display size with gold left accent */}
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-bark border-gold max-w-3xl border-l-2 pl-4 text-xl leading-relaxed break-words md:text-2xl"
        >
          {pullQuote}
        </m.p>

        {/* Stats as map plates */}
        <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {messages.about.stats.map((stat, i) => (
            <m.div
              key={stat.label}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={waypointPop}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <Card variant="plate" className="px-4 py-3 text-center">
                <div className="text-gold-deep font-serif text-4xl font-bold">{stat.value}</div>
                <div className="text-forest-deep mt-1 text-xs">{stat.label}</div>
              </Card>
            </m.div>
          ))}
        </div>

        {/* Personal closer */}
        <m.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="text-bark mt-6 max-w-3xl text-sm italic"
        >
          {messages.about.personalNote}
        </m.p>

        {/* Focus area pills */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.35, delay: 0.3 }}
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
