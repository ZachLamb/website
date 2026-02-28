'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { education, certifications } from '@/data/education';

export function Education() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="light" id="education" nature={{ leaves: true, pines: true }}>
      <AnimatedHeading sectionId="education" subtitle="V.">
        {messages.sections.education}
      </AnimatedHeading>

      <div ref={ref} className="mt-12 space-y-6">
        {education.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card>
              <motion.div
                initial={{ opacity: 0, rotate: -15 }}
                animate={isInView ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -15 }}
                transition={{ duration: 0.4, delay: i * 0.1 + 0.15 }}
              >
                <GraduationCap className="text-gold mb-3 h-6 w-6" />
              </motion.div>
              <h3 className="text-forest font-serif text-xl font-semibold">{entry.degree}</h3>
              <p className="text-bark text-sm">{entry.institution}</p>
              <p className="text-stone text-xs">
                {entry.startYear}–{entry.endYear}
              </p>
              {entry.field && <Badge className="mt-2">{entry.field}</Badge>}
              {entry.details.length > 0 && (
                <ul className="text-bark mt-3 list-inside list-disc space-y-1 text-sm">
                  {entry.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-forest font-serif text-lg font-semibold">Certifications</h3>
        <div className="mt-4 space-y-3">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: 0.4,
                delay: education.length * 0.1 + i * 0.1,
              }}
              className="flex items-center gap-3"
            >
              <Award className="text-gold h-5 w-5" />
              <div>
                <p className="text-bark font-medium">{cert.name}</p>
                <p className="text-stone text-sm">
                  {cert.issuer} · {cert.issuedDate}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
