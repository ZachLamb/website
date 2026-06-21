'use client';

import { useRef, useState, useEffect } from 'react';
import { m, useInView, AnimatePresence } from 'framer-motion';
import { AutoHeight } from '@/components/ui/AutoHeight';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { experiences } from '@/data/experience';
import type { ExperienceEntry } from '@/data/experience';
import { cn } from '@/lib/utils';

function TimelineCard({
  entry,
  index,
  onHover,
}: {
  entry: (typeof experiences)[number];
  index: number;
  onHover: (e: ExperienceEntry | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  const cardContent = (
    <CardContent entry={entry} align={isLeft ? 'right' : 'left'} isInView={isInView} />
  );

  const handleEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      onHover(entry);
    }
  };
  const handleLeave = () => onHover(null);

  return (
    <m.div
      ref={ref}
      className="group/timeline relative grid grid-cols-[24px_1fr] gap-x-4 md:grid-cols-[1fr_24px_1fr] md:gap-x-6"
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Left column: shows card for even indices on desktop, empty otherwise */}
      <div
        className="hidden md:block"
        data-testid={`experience-card-${entry.id}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleEnter}
      >
        {isLeft ? (
          <m.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="transition-transform duration-300 group-hover/timeline:translate-x-1"
          >
            <Card variant="map" className="text-right">
              {cardContent}
            </Card>
          </m.div>
        ) : null}
      </div>

      {/* Center trail line + waypoint marker */}
      <div className="relative flex justify-center">
        <div className="absolute inset-0 flex justify-center">
          <m.div
            className="border-gold/40 w-px border-l border-dashed"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ transformOrigin: 'top' }}
          />
        </div>
        <m.div
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
        </m.div>
      </div>

      {/* Right column: shows card for odd indices on desktop, all cards on mobile */}
      <div
        className="min-w-0"
        data-testid={!isLeft ? `experience-card-${entry.id}` : undefined}
        onMouseEnter={!isLeft ? handleEnter : undefined}
        onMouseLeave={!isLeft ? handleLeave : undefined}
        onClick={!isLeft ? handleEnter : undefined}
      >
        {isLeft ? (
          <m.div
            className="transition-transform duration-300 group-hover/timeline:translate-x-1 md:hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card variant="map">
              <CardContent entry={entry} align="left" isInView={isInView} />
            </Card>
          </m.div>
        ) : (
          <m.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="transition-transform duration-300 group-hover/timeline:-translate-x-1"
          >
            <Card variant="map">
              <CardContent entry={entry} align="left" isInView={isInView} />
            </Card>
          </m.div>
        )}
      </div>
    </m.div>
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

      <ul className="text-bark mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed">
        {entry.description.slice(0, 3).map((item, i) => (
          <m.li
            key={item}
            initial={{ opacity: 0, x: isRight ? 8 : -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isRight ? 8 : -8 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
          >
            {item}
          </m.li>
        ))}
      </ul>

      {entry.techStack.length > 0 && (
        <div className={`mt-3 flex flex-wrap gap-2 ${isRight ? 'justify-end' : ''}`}>
          {entry.techStack.map((tech, j) => (
            <m.span
              key={tech}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.3, delay: 0.35 + j * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Badge>{tech}</Badge>
            </m.span>
          ))}
        </div>
      )}

      {/* Inline trail elevation profile */}
      <div className="border-bark/10 mt-3 overflow-hidden rounded-md border">
        <TrailProfileGraph
          id={`inline-${entry.id}`}
          count={entry.description.length + entry.techStack.length}
          className="h-10"
        />
      </div>
    </div>
  );
}

/** Trail profile / elevation-style line (abstract "path" for this role) */
function TrailProfileGraph({ count, id, className }: { count: number; id: string; className?: string }) {
  const points = 8;
  const steps = Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    const y = 0.85 - 0.5 * Math.sin((i * ((count % 5) + 1)) / 2) * 0.4 - t * 0.3;
    return [t * 100, y * 100];
  });
  const d = steps.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const gradId = `trail-profile-${id}`;
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('text-gold w-full', className ?? 'h-14')}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d={`${d} L 100 100 L 0 100 Z`} fill={`url(#${gradId})`} />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
    </svg>
  );
}

function ExperienceDetailPanel({
  entry,
  side,
  moreLabel,
}: {
  entry: ExperienceEntry;
  side: 'left' | 'right';
  moreLabel: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, x: side === 'left' ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: side === 'left' ? -24 : 24 }}
      transition={{ duration: 0.25 }}
      className="border-bark/15 bg-parchment/95 pointer-events-none fixed top-1/2 z-40 w-[min(calc(50vw-3rem),calc(100vw-2rem))] max-w-[min(30rem,calc(100vw-2rem))] min-w-72 -translate-y-1/2 rounded-lg border border-dashed p-6 shadow-xl backdrop-blur-sm"
      style={
        side === 'left'
          ? { left: 'max(1rem, calc((100vw - 1280px) / 2 + 1rem))' }
          : { right: 'max(1rem, calc((100vw - 1280px) / 2 + 1rem))' }
      }
      aria-hidden
    >
      <p className="text-forest font-serif text-xl font-semibold">{entry.company}</p>
      <p className="text-bark mt-0.5 text-sm">{entry.position}</p>
      <p className="text-stone mt-1 text-xs">
        {entry.startDate} — {entry.endDate}
      </p>

      <div className="border-bark/10 mt-4 overflow-hidden rounded-md border">
        <TrailProfileGraph
          id={entry.id}
          count={entry.description.length + entry.techStack.length}
        />
      </div>

      <ul className="text-bark mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed">
        {entry.description.slice(0, 4).map((item, i) => (
          <li key={i}>{item}</li>
        ))}
        {entry.description.length > 4 && (
          <li className="text-stone text-xs">
            +{entry.description.length - 4} {moreLabel}
          </li>
        )}
      </ul>

      {entry.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      )}
    </m.div>
  );
}

export function Experience() {
  const { messages } = useLocaleContext();
  const [hoveredEntry, setHoveredEntry] = useState<ExperienceEntry | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', handler);
    handler();
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!hoveredEntry) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHoveredEntry(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hoveredEntry]);

  const featuredExperiences = experiences.filter((e) => e.featured);
  const olderExperiences = experiences.filter((e) => !e.featured);
  const olderDateRange = olderExperiences.length > 0
    ? `${olderExperiences[olderExperiences.length - 1].startDate.split(' ')[1]}–${olderExperiences[0].endDate === 'Present' ? 'Present' : olderExperiences[0].endDate.split(' ')[1]}`
    : '';

  return (
    <Section variant="light" id="experience" mapFrame nature={{ leaves: true, pines: true }}>
      <div className="bg-parchment/95 sticky top-16 z-30 -mx-4 mb-12 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <AnimatedHeading sectionId="experience" subtitle="II." className="md:mb-0">
          {messages.sections.experience}
        </AnimatedHeading>
      </div>

      <AnimatePresence>
        {isDesktop && hoveredEntry && (
          <ExperienceDetailPanel
            key={hoveredEntry.id}
            entry={hoveredEntry}
            side={experiences.indexOf(hoveredEntry) % 2 === 0 ? 'right' : 'left'}
            moreLabel={messages.experience.more}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8">
        {featuredExperiences.map((entry, i) => (
          <TimelineCard key={entry.id} entry={entry} index={i} onHover={setHoveredEntry} />
        ))}
      </div>

      {olderExperiences.length > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className="border-gold/40 text-gold hover:border-gold/60 focus-visible:ring-gold flex w-full items-center justify-between rounded-lg border border-dashed px-5 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="font-medium">
              {showHistory ? '▾' : '▸'}{' '}
              {showHistory
                ? messages.experience.hideHistory
                : messages.experience.viewFullHistory}
            </span>
            <span className="text-stone text-sm">
              {olderExperiences.length} earlier roles · {olderDateRange}
            </span>
          </button>

          <AutoHeight>
            {showHistory && (
              <div className="mt-8 flex flex-col gap-8">
                {olderExperiences.map((entry, i) => (
                  <TimelineCard
                    key={entry.id}
                    entry={entry}
                    index={featuredExperiences.length + i}
                    onHover={setHoveredEntry}
                  />
                ))}
              </div>
            )}
          </AutoHeight>
        </div>
      )}
    </Section>
  );
}
