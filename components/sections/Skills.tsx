'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { skillCategories, maxYearsForScale } from '@/data/skills';

function ExperienceBar({
  years,
  maxYears,
  index,
  isInView,
  categoryIndex,
  yearAbbrev,
  yearAbbrevPlural,
}: {
  years: number;
  maxYears: number;
  index: number;
  isInView: boolean;
  categoryIndex: number;
  yearAbbrev: string;
  yearAbbrevPlural: string;
}) {
  const widthPercent = Math.min(100, (years / maxYears) * 100);

  return (
    <div className="group flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
          transition={{
            duration: 0.35,
            delay: categoryIndex * 0.08 + index * 0.04,
          }}
          className="text-parchment/90 font-medium"
        >
          {years} {years === 1 ? yearAbbrev : yearAbbrevPlural}
        </motion.span>
      </div>
      <div className="bg-forest/40 relative h-2 overflow-hidden rounded-full" aria-hidden>
        <motion.div
          className="from-moss to-gold/80 absolute inset-y-0 left-0 rounded-full bg-linear-to-r"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${widthPercent}%` } : { width: 0 }}
          transition={{
            duration: 0.8,
            delay: categoryIndex * 0.08 + index * 0.04,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}

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
          <motion.div
            key={category.id}
            role="article"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border-moss/20 bg-forest/10 rounded-xl border p-6 backdrop-blur-sm"
          >
            <h3 className="text-parchment mb-5 font-serif text-xl font-semibold">
              {category.name}
            </h3>
            <div className="space-y-4">
              {category.skills
                .slice()
                .sort((a, b) => b.years - a.years)
                .map((skill, j) => (
                  <div key={skill.name} className="flex items-end gap-4">
                    <span className="text-parchment/90 min-w-32 shrink-0 text-sm font-medium">
                      {skill.name}
                    </span>
                    <div className="min-w-0 flex-1">
                      <ExperienceBar
                        years={skill.years}
                        maxYears={maxYearsForScale}
                        index={j}
                        isInView={isInView}
                        categoryIndex={i}
                        yearAbbrev={messages.skills.yearAbbrev}
                        yearAbbrevPlural={messages.skills.yearAbbrevPlural}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-stone/70 mt-6 text-xs">
        {messages.skills.scaleDescription.replace('{max}', String(maxYearsForScale))}
      </p>
    </Section>
  );
}
