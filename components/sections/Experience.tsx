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

function EntryMarker({ number }: { number: number }) {
  return (
    <div className="border-gold bg-parchment text-gold-deep relative z-10 mt-5 flex h-6 w-6 items-center justify-center rounded-full border font-serif text-xs font-semibold">
      {number}
    </div>
  );
}

function TimelineCard({
  entry,
  number,
  onHover,
}: {
  entry: (typeof experiences)[number];
  number: number;
  onHover: (e: ExperienceEntry | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const handleEnter = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
      onHover(entry);
    }
  };
  const handleLeave = () => onHover(null);

  return (
    <div ref={ref} className="group/timeline grid grid-cols-[32px_1fr] gap-x-4 md:gap-x-6">
      {/* Trail line + numbered marker */}
      <div className="relative flex justify-center">
        <div className="border-gold/40 absolute inset-y-0 left-1/2 w-px -translate-x-1/2 border-l border-dashed" />
        <EntryMarker number={number} />
      </div>

      {/* Entry card */}
      <div
        className="max-w-xl min-w-0"
        data-testid={`experience-card-${entry.id}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleEnter}
      >
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
          className="transition-transform duration-300 group-hover/timeline:translate-x-1"
        >
          <Card variant="plate">
            <CardContent entry={entry} isInView={isInView} />
          </Card>
        </m.div>
      </div>
    </div>
  );
}

function CardContent({
  entry,
  isInView,
}: {
  entry: (typeof experiences)[number];
  isInView: boolean;
}) {
  return (
    <div>
      <h3 className="text-forest-deep font-serif text-xl font-semibold">{entry.company}</h3>
      <p className="text-bark text-sm">{entry.position}</p>
      {/* Trail-distance date range */}
      <p className="text-stone flex items-center gap-1.5 text-xs">
        {entry.startDate}
        <span aria-hidden="true" className="bg-gold/40 inline-block h-px w-6" />
        <span
          aria-hidden="true"
          className="border-gold/40 -ml-1.5 inline-block border-y-2 border-l-4 border-y-transparent"
        />
        {entry.endDate}
      </p>

      <ul className="text-bark mt-3 list-inside list-disc space-y-1 text-sm leading-relaxed">
        {entry.description.slice(0, 3).map((item, i) => (
          <m.li
            key={item}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.06 }}
          >
            {item}
          </m.li>
        ))}
      </ul>

      {entry.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.techStack.map((tech, j) => (
            <m.span
              key={tech}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, delay: 0.15 + j * 0.04 }}
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
function TrailProfileGraph({
  count,
  id,
  className,
}: {
  count: number;
  id: string;
  className?: string;
}) {
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
  const olderDateRange =
    olderExperiences.length > 0
      ? `${olderExperiences[olderExperiences.length - 1].startDate.split(' ')[1]}–${olderExperiences[0].endDate === 'Present' ? 'Present' : olderExperiences[0].endDate.split(' ')[1]}`
      : '';

  return (
    <Section variant="light" id="experience" mapFrame nature={{ leaves: true, pines: true }}>
      <div className="bg-parchment/95 sticky top-16 z-30 -mx-4 mb-12 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <AnimatedHeading
          sectionId="experience"
          subtitle={`II · ${messages.kickers.experience}`}
          className="md:mb-0"
        >
          {messages.sections.experience}
        </AnimatedHeading>
      </div>

      <AnimatePresence>
        {isDesktop && hoveredEntry && (
          <ExperienceDetailPanel
            key={hoveredEntry.id}
            entry={hoveredEntry}
            side="right"
            moreLabel={messages.experience.more}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        {featuredExperiences.map((entry, i) => (
          <TimelineCard key={entry.id} entry={entry} number={i + 1} onHover={setHoveredEntry} />
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
              {showHistory ? messages.experience.hideHistory : messages.experience.viewFullHistory}
            </span>
            <span className="text-stone text-sm">
              {olderExperiences.length} {messages.experience.earlierRoles} · {olderDateRange}
            </span>
          </button>

          <AutoHeight>
            {showHistory && (
              <div className="mt-8 flex flex-col gap-2">
                {olderExperiences.map((entry, i) => (
                  <TimelineCard
                    key={entry.id}
                    entry={entry}
                    number={featuredExperiences.length + i + 1}
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
