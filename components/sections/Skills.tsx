'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { skillCategories } from '@/data/skills';

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="dark" id="skills" nature={{ fireflies: true }}>
      <AnimatedHeading
        sectionId="skills"
        subtitle="III."
        className="[&_p]:text-gold [&_h2]:text-parchment"
      >
        Gear &amp; Provisions
      </AnimatedHeading>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <h3 className="text-parchment mb-4 font-serif text-xl font-semibold">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, j) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.3, delay: i * 0.1 + j * 0.03 }}
                  className="border-moss/30 bg-forest text-parchment/80 hover:border-gold/40 rounded-full border px-3 py-1 text-xs transition-all hover:shadow-[0_0_8px_rgba(184,134,11,0.2)]"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
