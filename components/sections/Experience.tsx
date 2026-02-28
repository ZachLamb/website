'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { experiences } from '@/data/experience';

function TimelineCard({ entry, index }: { entry: (typeof experiences)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  const cardContent = (
    <CardContent entry={entry} align={isLeft ? 'right' : 'left'} isInView={isInView} />
  );

  return (
    <motion.div
      ref={ref}
      className="group/timeline relative grid grid-cols-[24px_1fr] gap-x-4 md:grid-cols-[1fr_24px_1fr] md:gap-x-6"
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Left column: shows card for even indices on desktop, empty otherwise */}
      <div className="hidden md:block">
        {isLeft ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="transition-transform duration-300 group-hover/timeline:translate-x-1"
          >
            <Card className="text-right">{cardContent}</Card>
          </motion.div>
        ) : null}
      </div>

      {/* Center trail line + waypoint marker */}
      <div className="relative flex justify-center">
        <div className="absolute inset-0 flex justify-center">
          <motion.div
            className="border-gold/40 w-px border-l border-dashed"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ transformOrigin: 'top' }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: 0.2, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.15 }}
          className="ring-offset-parchment group-hover/timeline:ring-gold/30 relative z-10 mt-5 cursor-default rounded-full ring-2 ring-transparent ring-offset-2 transition-shadow duration-300"
        >
          <svg viewBox="0 0 20 20" className="text-gold h-5 w-5">
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="var(--color-parchment)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 5 C12 7 13 9 12.5 12 C11.5 14 10 15 10 15 C10 15 8.5 14 7.5 12 C7 9 8 7 10 5Z"
              fill="currentColor"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </div>

      {/* Right column: shows card for odd indices on desktop, all cards on mobile */}
      <div className="min-w-0">
        {isLeft ? (
          <motion.div
            className="transition-transform duration-300 group-hover/timeline:translate-x-1 md:hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent entry={entry} align="left" isInView={isInView} />
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="transition-transform duration-300 group-hover/timeline:-translate-x-1"
          >
            <Card>
              <CardContent entry={entry} align="left" isInView={isInView} />
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function CardContent({
  entry,
  align,
  isInView,
}: {
  entry: (typeof experiences)[number];
  align: 'left' | 'right';
  isInView: boolean;
}) {
  const isRight = align === 'right';

  return (
    <div className={isRight ? 'text-right' : ''}>
      <h3 className="text-forest font-serif text-xl font-semibold">{entry.company}</h3>
      <p className="text-bark text-sm">{entry.position}</p>
      <p className="text-stone text-xs">
        {entry.startDate} — {entry.endDate}
      </p>

      <ul className="text-bark mt-3 list-inside space-y-1 text-sm leading-relaxed">
        {entry.description.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: isRight ? 8 : -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isRight ? 8 : -8 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
          >
            • {item}
          </motion.li>
        ))}
      </ul>

      {entry.techStack.length > 0 && (
        <div className={`mt-3 flex flex-wrap gap-2 ${isRight ? 'justify-end' : ''}`}>
          {entry.techStack.map((tech, j) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, delay: 0.35 + j * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Badge>{tech}</Badge>
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Experience() {
  return (
    <Section variant="light" id="experience" nature={{ leaves: true, pines: true }}>
      <AnimatedHeading sectionId="experience" subtitle="II." className="mb-12">
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
