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

  return (
    <Section variant="light" id="about" nature={{ leaves: true, birds: true }} className="md:pb-16">
      <AnimatedHeading
        sectionId="about"
        subtitle={`I · ${messages.kickers.about}`}
        className="mb-8"
      >
        {messages.about.heading}
      </AnimatedHeading>

      {/* Two columns from lg up: the statement on the left, the stat plates
          as a 2x2 block on the right. Below lg the plates drop under the
          statement, so the right half of the section is never left empty. */}
      <div
        ref={ref}
        className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-12"
      >
        <div>
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-bark border-gold border-l-2 pl-4 text-lg leading-relaxed break-words sm:text-xl"
          >
            {pullQuote}
          </m.p>

          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="text-slate mt-6 pl-4 text-sm italic sm:text-base"
          >
            {messages.about.personalNote}
          </m.p>
        </div>

        {/* Stats as map plates */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {messages.about.stats.map((stat, i) => (
            <m.div
              key={stat.label}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={waypointPop}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="h-full"
            >
              <Card
                variant="plate"
                className="flex h-full flex-col items-center justify-center px-3 py-5 text-center"
              >
                <div className="text-gold-deep font-serif text-3xl font-bold lining-nums sm:text-4xl">
                  {stat.value}
                </div>
                <div className="text-forest-deep mt-1.5 text-xs leading-tight sm:text-sm">
                  {stat.label}
                </div>
              </Card>
            </m.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
