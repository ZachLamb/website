'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { skillCategories } from '@/data/skills';
import { cn } from '@/lib/utils';

export function Skills() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <Section variant="dark" id="skills" nature={{ fireflies: true }}>
      <AnimatedHeading
        sectionId="skills"
        subtitle={`III · ${messages.kickers.skills}`}
        className="[&_p]:text-gold [&_h2]:text-parchment"
      >
        {messages.sections.skills}
      </AnimatedHeading>

      <p className="text-stone/90 mt-4 max-w-2xl text-base">{messages.skills.intro}</p>

      <div ref={ref} className="mt-10 grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <m.div
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <h3 className="text-gold mb-3 text-sm font-semibold tracking-wider uppercase">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => {
                const isPrimary = skill.years >= 5;
                const isEmerging = skill.years <= 1;
                return (
                  <span
                    key={skill.name}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-sm',
                      isPrimary
                        ? 'border-gold/50 bg-gold/10 text-parchment font-medium'
                        : isEmerging
                          ? 'border-moss/20 bg-moss/10 text-parchment/60'
                          : 'bg-moss/20 border-moss/30 text-parchment/85',
                    )}
                  >
                    {skill.name} · {skill.years}y
                  </span>
                );
              })}
            </div>
          </m.div>
        ))}
      </div>
    </Section>
  );
}
