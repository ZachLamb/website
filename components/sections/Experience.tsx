'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { experiences } from '@/data/experience';

function TimelineCard({
  entry,
  index,
}: {
  entry: (typeof experiences)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  const cardContent = <CardContent entry={entry} align={isLeft ? 'right' : 'left'} />;

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[24px_1fr] gap-x-4 md:grid-cols-[1fr_24px_1fr] md:gap-x-6"
    >
      {/* Left column: shows card for even indices on desktop, empty otherwise */}
      <div className="hidden md:block">
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="text-right">{cardContent}</Card>
          </motion.div>
        ) : null}
      </div>

      {/* Center trail line + waypoint marker */}
      <div className="relative flex justify-center">
        <div className="absolute inset-0 flex justify-center">
          <div className="w-px border-l border-dashed border-gold/40" />
        </div>
        <div className="relative z-10 mt-6 h-3.5 w-3.5 rounded-full border-2 border-gold bg-parchment" />
      </div>

      {/* Right column: shows card for odd indices on desktop, all cards on mobile */}
      <div>
        {isLeft ? (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent entry={entry} align="left" />
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent entry={entry} align="left" />
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CardContent({
  entry,
  align,
}: {
  entry: (typeof experiences)[number];
  align: 'left' | 'right';
}) {
  const isRight = align === 'right';

  return (
    <div className={isRight ? 'text-right' : ''}>
      <h3 className="font-serif text-xl font-semibold text-forest">
        {entry.company}
      </h3>
      <p className="text-sm text-bark">{entry.position}</p>
      <p className="text-xs text-stone">
        {entry.startDate} — {entry.endDate}
      </p>

      <ul className="mt-3 list-inside space-y-1 text-sm leading-relaxed text-bark">
        {entry.description.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>

      {entry.techStack.length > 0 && (
        <div
          className={`mt-3 flex flex-wrap gap-2 ${isRight ? 'justify-end' : ''}`}
        >
          {entry.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function Experience() {
  return (
    <Section variant="light" id="experience">
      <AnimatedHeading subtitle="II." className="mb-12">
        Trail Log
      </AnimatedHeading>

      <div className="flex flex-col gap-8">
        {experiences.map((entry, i) => (
          <TimelineCard key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </Section>
  );
}
