'use client';

import { useId, useState } from 'react';
import { Award, ChevronDown } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { education, certifications } from '@/data/education';
import { waypointNumber } from '@/lib/waypoints';
import { cn } from '@/lib/utils';

function EducationRow({ entry }: { entry: (typeof education)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const hasDetails = entry.details.length > 0;
  const RowTag = hasDetails ? 'button' : 'div';

  return (
    <li className="bg-paper-raised">
      {/* Only a row with details is a button. A row without them used to be
          a disabled button, which screen readers announce as an unavailable
          control. */}
      <RowTag
        {...(hasDetails
          ? {
              type: 'button' as const,
              onClick: () => setExpanded((e) => !e),
              'aria-expanded': expanded,
              'aria-controls': detailsId,
            }
          : {})}
        className={cn(
          // Years sit above the degree on a phone and in their own column
          // from sm up, so neither has to share a cramped line.
          'grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 p-5 text-left sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:p-6',
          hasDetails &&
            'hover:bg-paper focus-visible:ring-blaze cursor-pointer touch-manipulation transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
        )}
      >
        <span className="text-ink-soft col-span-2 font-mono text-xs tracking-wider tabular-nums sm:col-span-1 sm:pt-1.5">
          {entry.startYear}–{entry.endYear}
        </span>
        <span className="min-w-0">
          <span className="text-ink block font-serif text-2xl leading-tight font-semibold">
            {entry.degree}
          </span>
          <span className="text-ink-soft mt-1 block text-base">{entry.institution}</span>
          {entry.field && <Badge className="mt-2">{entry.field}</Badge>}
        </span>
        {hasDetails && (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'text-blaze mt-1.5 h-5 w-5 shrink-0 transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        )}
      </RowTag>

      {hasDetails && (
        <div id={detailsId}>
          {expanded && (
            <ul className="text-ink-soft marker:text-blaze list-outside list-disc space-y-1.5 px-5 pb-5 pl-10 text-base sm:px-6 sm:pb-6 sm:pl-[calc(7.5rem+2.75rem)]">
              {entry.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

export function Education() {
  const { messages } = useLocaleContext();

  return (
    <Section id="education" surface="paper" after="night">
      <SectionHeading
        sectionId="education"
        number={waypointNumber('education')}
        kicker={messages.kickers.education}
      >
        {messages.sections.education}
      </SectionHeading>

      <Reveal className="mt-8">
        <Card as="div" className="bg-contour/40 overflow-hidden">
          <ul className="flex flex-col gap-px">
            {education.map((entry) => (
              <EducationRow key={entry.id} entry={entry} />
            ))}
          </ul>
        </Card>
      </Reveal>

      <Reveal className="mt-10">
        <h3 className="text-blaze flex items-center gap-3 font-mono text-xs font-medium tracking-[0.18em] uppercase">
          {messages.education.certifications}
          <span aria-hidden="true" className="bg-contour/40 h-px flex-1" />
        </h3>
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {certifications.map((cert) => (
            <li key={cert.id}>
              <Card className="flex h-full items-start gap-3 p-4">
                <Award aria-hidden="true" className="text-blaze mt-0.5 h-5 w-5 shrink-0" />
                <span className="min-w-0">
                  <span className="text-ink block font-medium">{cert.name}</span>
                  {cert.issuer && (
                    <span className="text-ink-soft mt-0.5 block text-sm">{cert.issuer}</span>
                  )}
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
