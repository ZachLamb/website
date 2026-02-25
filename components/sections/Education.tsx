'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { education, certifications } from '@/data/education';

export function Education() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="light" id="education">
      <AnimatedHeading subtitle="V.">Ranger Credentials</AnimatedHeading>

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
                <GraduationCap className="mb-3 h-6 w-6 text-gold" />
              </motion.div>
              <h3 className="font-serif text-xl font-semibold text-forest">
                {entry.degree}
              </h3>
              <p className="text-sm text-bark">{entry.institution}</p>
              <p className="text-xs text-stone">
                {entry.startYear}–{entry.endYear}
              </p>
              {entry.field && <Badge className="mt-2">{entry.field}</Badge>}
              {entry.details.length > 0 && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-bark">
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
        <h3 className="font-serif text-lg font-semibold text-forest">
          Certifications
        </h3>
        <div className="mt-4 space-y-3">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              transition={{
                duration: 0.4,
                delay: education.length * 0.1 + i * 0.1,
              }}
              className="flex items-center gap-3"
            >
              <Award className="h-5 w-5 text-gold" />
              <div>
                <p className="font-medium text-bark">{cert.name}</p>
                <p className="text-sm text-stone">
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
