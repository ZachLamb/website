'use client';

import { useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { AutoHeight } from '@/components/ui/AutoHeight';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { experiences } from '@/data/experience';
import { cn } from '@/lib/utils';

function EntryMarker({ number }: { number: number }) {
  return (
    <div className="border-gold bg-parchment text-gold-deep relative z-10 mt-5 flex h-6 w-6 items-center justify-center rounded-full border font-serif text-xs font-semibold">
      {number}
    </div>
  );
}

function TimelineCard({ entry, number }: { entry: (typeof experiences)[number]; number: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className="group/timeline grid grid-cols-[32px_1fr] gap-x-4 md:gap-x-6">
      {/* Numbered marker (the trail line itself is drawn once, continuously,
          by the parent TimelineList — see its own comment for why) */}
      <div className="relative flex justify-center">
        <EntryMarker number={number} />
      </div>

      {/* Entry card */}
      <div className="min-w-0" data-testid={`experience-card-${entry.id}`}>
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

/**
 * Wraps a group of TimelineCards with one continuous dashed trail line
 * behind them. Drawing the line once here — instead of one segment per
 * entry — keeps it visually unbroken across the seams between
 * entries; a per-entry `inset-y-0` line only spans its own row's box and
 * leaves an 8px break at every gap.
 */
function TimelineList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div
        aria-hidden="true"
        className="border-gold/40 absolute inset-y-0 left-4 w-px -translate-x-1/2 border-l border-dashed"
      />
      {children}
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
  // A freelance stint has no separate employer, so company === position;
  // printing both would just repeat the line.
  const showCompany = entry.company !== entry.position;

  return (
    <div>
      {/* Role leads, employer follows, dates sit on the right from sm up so
          the three facts a reader scans for are on one line. */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="text-forest-deep font-serif text-xl font-semibold sm:text-2xl">
            {entry.position}
          </h3>
          {showCompany && <p className="text-gold-deep text-sm font-medium">{entry.company}</p>}
        </div>
        {/* Trail-distance date range */}
        <p className="text-slate flex shrink-0 items-center gap-1.5 text-xs sm:text-sm">
          {entry.startDate}
          <span aria-hidden="true" className="bg-gold/40 inline-block h-px w-6" />
          <span
            aria-hidden="true"
            className="border-gold/40 -ml-1.5 inline-block border-y-2 border-l-4 border-y-transparent"
          />
          {entry.endDate}
        </p>
      </div>

      <ul className="text-bark marker:text-gold mt-4 list-outside list-disc space-y-1.5 pl-5 text-sm leading-relaxed sm:text-base">
        {entry.description.map((item, i) => (
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
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.techStack.map((tech, j) => (
            <m.span
              key={tech}
              className="inline-block"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, delay: 0.15 + j * 0.04 }}
            >
              <Badge>{tech}</Badge>
            </m.span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Experience() {
  const { messages } = useLocaleContext();
  const [showHistory, setShowHistory] = useState(false);

  const featuredExperiences = experiences.filter((e) => e.featured);
  const olderExperiences = experiences.filter((e) => !e.featured);
  const olderDateRange =
    olderExperiences.length > 0
      ? `${olderExperiences[olderExperiences.length - 1].startDate.split(' ')[1]}–${olderExperiences[0].endDate === 'Present' ? 'Present' : olderExperiences[0].endDate.split(' ')[1]}`
      : '';

  return (
    <Section variant="light" id="experience" mapFrame nature={{ leaves: true, pines: true }}>
      <div className="mb-8 md:mb-12">
        <AnimatedHeading
          sectionId="experience"
          subtitle={`III · ${messages.kickers.experience}`}
          className="md:mb-0"
        >
          {messages.sections.experience}
        </AnimatedHeading>
      </div>

      <TimelineList className="flex flex-col gap-4">
        {featuredExperiences.map((entry, i) => (
          <TimelineCard key={entry.id} entry={entry} number={i + 1} />
        ))}
      </TimelineList>

      <p className="text-slate mt-4 text-xs italic">{messages.experience.tenureNote}</p>

      {olderExperiences.length > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className="border-gold-deep/40 text-gold-deep hover:border-gold-deep/60 focus-visible:ring-gold flex w-full items-center justify-between rounded-lg border border-dashed px-5 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="font-medium">
              {showHistory ? '▾' : '▸'}{' '}
              {showHistory ? messages.experience.hideHistory : messages.experience.viewFullHistory}
            </span>
            <span className="text-slate text-sm">
              {olderExperiences.length} {messages.experience.earlierRoles} · {olderDateRange}
            </span>
          </button>

          <AutoHeight>
            {showHistory && (
              <TimelineList className="mt-8 flex flex-col gap-4">
                {olderExperiences.map((entry, i) => (
                  <TimelineCard
                    key={entry.id}
                    entry={entry}
                    number={featuredExperiences.length + i + 1}
                  />
                ))}
              </TimelineList>
            )}
          </AutoHeight>
        </div>
      )}
    </Section>
  );
}
