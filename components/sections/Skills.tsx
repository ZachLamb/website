'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { skillCategories, maxYearsForScale } from '@/data/skills';

export function Skills() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <Section variant="dark" id="skills" nature={{ fireflies: true }}>
      <AnimatedHeading
        sectionId="skills"
        subtitle="III."
        className="[&_p]:text-gold [&_h2]:text-parchment"
      >
        {messages.sections.skills}
      </AnimatedHeading>

      <p className="text-stone/90 mt-4 max-w-2xl text-base">{messages.skills.intro}</p>

      <div ref={ref} className="mt-10 grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <m.div
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border-moss/20 bg-forest/10 rounded-xl border p-6 backdrop-blur-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 20h40M20 0v40' fill='none' stroke='%23f5f0e8' stroke-width='0.15' opacity='0.04'/%3E%3C/svg%3E")`,
            }}
          >
            <h3 className="text-parchment mb-5 font-serif text-xl font-semibold">
              {category.name}
            </h3>
            <div className="space-y-4">
              {category.skills
                .slice()
                .sort((a, b) => b.years - a.years)
                .map((skill, j) => (
                  <div key={skill.name} className="group/bar flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <m.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                        transition={{ duration: 0.35, delay: i * 0.08 + j * 0.04 }}
                        className="text-parchment/90 text-sm font-medium"
                      >
                        {skill.name}
                      </m.span>
                      <m.span
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.08 + j * 0.04 + 0.3 }}
                        className="text-parchment/50 text-xs opacity-0 transition-opacity group-hover/bar:opacity-100"
                      >
                        {skill.years}{' '}
                        {skill.years === 1
                          ? messages.skills?.yearAbbrev
                          : messages.skills?.yearAbbrevPlural}
                      </m.span>
                    </div>
                    <div className="bg-forest/40 relative h-2.5 overflow-hidden rounded-full" aria-hidden>
                      <m.div
                        className="from-moss to-gold/80 absolute inset-y-0 left-0 rounded-full bg-linear-to-r"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${Math.min(100, (skill.years / maxYearsForScale) * 100)}%` } : { width: 0 }}
                        transition={{ duration: 0.8, delay: i * 0.08 + j * 0.04, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </m.div>
        ))}
      </div>

      <p className="text-stone/70 mt-6 text-xs">
        {messages.skills.scaleDescription.replace('{max}', String(maxYearsForScale))}
      </p>
    </Section>
  );
}
