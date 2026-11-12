'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/BrandIcons';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import type { Messages } from '@/lib/i18n';
import { endorsements } from '@/data/endorsements';
import { socialLinks } from '@/data/social';
import { waypointNumber } from '@/lib/waypoints';
import { cn } from '@/lib/utils';

const linkedInUrl = socialLinks.find((l) => l.icon === 'linkedin')?.url ?? '';
const linkedInRecommendationsUrl = `${linkedInUrl}details/recommendations/`;

/** Quotes longer than this are clamped on a phone, with a toggle to open. */
const CLAMP_OVER = 240;

function EndorsementCard({
  endorsement,
  messages,
}: {
  endorsement: (typeof endorsements)[number];
  messages: Messages['endorsements'];
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = endorsement.quote.length > CLAMP_OVER;

  return (
    <Card as="figure" className="flex h-full flex-col p-5 sm:p-6">
      <span aria-hidden="true" className="text-blaze font-serif text-6xl leading-[0.6] font-bold">
        &ldquo;
      </span>
      <blockquote className="text-ink flex-1 text-base leading-relaxed">
        {/* The clamp applies below md only. From md up there is room for the
            whole quote, so the toggle is hidden there too. */}
        <p className={cn(isLong && !expanded && 'line-clamp-6 md:line-clamp-none')}>
          {endorsement.quote}
        </p>
      </blockquote>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="text-blaze hover:text-ink focus-visible:ring-blaze -ml-2 flex min-h-11 touch-manipulation items-center gap-1 self-start rounded-sm px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none md:hidden"
        >
          {expanded ? messages.showLess : messages.readMore}
          <ChevronDown
            aria-hidden="true"
            className={cn('h-4 w-4 transition-transform duration-200', expanded && 'rotate-180')}
          />
        </button>
      )}
      <figcaption className="border-contour/40 mt-4 border-t pt-4">
        <cite className="text-ink block font-serif text-xl font-semibold not-italic">
          {endorsement.author}
        </cite>
        {endorsement.role && (
          <span className="text-ink-soft mt-0.5 block text-sm">{endorsement.role}</span>
        )}
        {endorsement.context && (
          <span className="text-ink-soft mt-2 block font-mono text-[11px] tracking-wider uppercase">
            {endorsement.context}
          </span>
        )}
      </figcaption>
    </Card>
  );
}

export function Endorsements() {
  const { messages } = useLocaleContext();

  return (
    <Section id="endorsements" surface="meadow" after="paper">
      <SectionHeading
        sectionId="endorsements"
        number={waypointNumber('endorsements')}
        kicker={messages.kickers.endorsements}
      >
        {messages.sections.endorsements}
      </SectionHeading>
      <p className="text-ink-soft mt-4 max-w-2xl text-lg">{messages.endorsements.intro}</p>

      {/* A plain stack on phones and tablets, three across from lg. Every
          recommendation is on the page at every width: no carousel, so no
          sideways scroller competing with the page's own scroll. */}
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {endorsements.map((endorsement, i) => (
          <Reveal as="li" key={endorsement.id} delay={i * 0.06}>
            <EndorsementCard endorsement={endorsement} messages={messages.endorsements} />
          </Reveal>
        ))}
      </ul>

      <p className="mt-6">
        <a
          href={linkedInRecommendationsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={messages.endorsements.viewAllOnLinkedInAria}
          className="text-blaze hover:text-ink focus-visible:ring-blaze inline-flex min-h-11 items-center gap-2 rounded-sm font-medium underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <LinkedinIcon className="h-5 w-5 shrink-0" />
          {messages.endorsements.viewAllOnLinkedIn}
        </a>
      </p>
    </Section>
  );
}
