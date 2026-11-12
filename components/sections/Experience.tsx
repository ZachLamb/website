'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { experiences } from '@/data/experience';
import { waypointNumber } from '@/lib/waypoints';
import { cn } from '@/lib/utils';

type Entry = (typeof experiences)[number];

function TimelineEntry({ entry }: { entry: Entry }) {
  // A freelance stint has no separate employer, so company === position;
  // printing both would just repeat the line.
  const showCompany = entry.company !== entry.position;

  return (
    <Reveal as="li" className="relative md:pl-12">
      {/* Trail marker on the line (md and up, where the line is drawn).
          Deliberately unnumbered: numbers on this page mean sections. */}
      <span
        aria-hidden="true"
        data-trail-marker
        className="border-blaze bg-paper absolute top-6 left-4 hidden h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-2 md:block"
      />

      <Card as="article" className="p-5 sm:p-6" data-testid={`experience-card-${entry.id}`}>
        <p className="text-ink-soft flex flex-wrap items-center gap-x-2 font-mono text-xs tracking-wider uppercase">
          <span>{entry.startDate}</span>
          <span aria-hidden="true" className="text-blaze">
            →
          </span>
          <span className="sr-only">to</span>
          <span>{entry.endDate}</span>
        </p>
        <h3 className="text-ink mt-2 font-serif text-2xl leading-tight font-semibold sm:text-3xl">
          {entry.position}
        </h3>
        {showCompany && <p className="text-blaze mt-1 text-base font-medium">{entry.company}</p>}

        <ul className="text-ink-soft marker:text-blaze mt-4 list-outside list-disc space-y-2 pl-5 text-base leading-relaxed">
          {entry.description.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {entry.techStack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {entry.techStack.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Reveal>
  );
}

/**
 * One continuous dashed trail line behind a group of entries, drawn once
 * here rather than per entry so it has no breaks at the gaps between them.
 * md and up only: on a phone the 48px it needs is worth more as text width.
 */
function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <ol className="relative flex flex-col gap-4 sm:gap-5">
      <li
        aria-hidden="true"
        role="presentation"
        className="border-blaze/50 absolute inset-y-0 left-4 hidden -translate-x-1/2 border-l border-dashed md:block"
      />
      {children}
    </ol>
  );
}

export function Experience() {
  const { messages } = useLocaleContext();
  const [showHistory, setShowHistory] = useState(false);
  const historyId = useId();

  const featured = experiences.filter((e) => e.featured);
  const older = experiences.filter((e) => !e.featured);
  const olderDateRange =
    older.length > 0
      ? `${older[older.length - 1].startDate.split(' ')[1]}–${older[0].endDate === 'Present' ? 'Present' : older[0].endDate.split(' ')[1]}`
      : '';

  return (
    <Section id="experience" surface="paper" after="meadow">
      <SectionHeading
        sectionId="experience"
        number={waypointNumber('experience')}
        kicker={messages.kickers.experience}
      >
        {messages.sections.experience}
      </SectionHeading>

      <div className="mt-8 md:mt-10">
        <Timeline>
          {featured.map((entry) => (
            <TimelineEntry key={entry.id} entry={entry} />
          ))}
        </Timeline>
      </div>

      <p className="text-ink-soft mt-4 text-sm italic md:pl-12">{messages.experience.tenureNote}</p>

      {older.length > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            aria-expanded={showHistory}
            aria-controls={historyId}
            className="border-blaze/60 text-ink hover:border-blaze hover:bg-paper-raised focus-visible:ring-blaze flex min-h-14 w-full touch-manipulation items-center justify-between gap-4 rounded-md border border-dashed px-5 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="min-w-0">
              <span className="block font-medium">
                {showHistory
                  ? messages.experience.hideHistory
                  : messages.experience.viewFullHistory}
              </span>
              <span className="text-ink-soft mt-0.5 block font-mono text-xs tracking-wider uppercase">
                {older.length} {messages.experience.earlierRoles} · {olderDateRange}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                'text-blaze h-5 w-5 shrink-0 transition-transform duration-200',
                showHistory && 'rotate-180',
              )}
            />
          </button>

          {/* The earlier roles open below the button, so opening or closing
              them never moves what the reader is looking at. */}
          <div id={historyId}>
            {showHistory && (
              <div className="mt-5">
                <Timeline>
                  {older.map((entry) => (
                    <TimelineEntry key={entry.id} entry={entry} />
                  ))}
                </Timeline>
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}
