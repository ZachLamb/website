'use client';

import { useRef, useState } from 'react';
import { m, useInView, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/BrandIcons';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import type { Locale, Messages } from '@/lib/i18n';
import { endorsements } from '@/data/endorsements';
import { socialLinks } from '@/data/social';
import { trailFadeUp } from '@/lib/trail-animations';

const linkedInUrl = socialLinks.find((l) => l.icon === 'linkedin')?.url ?? '';
const linkedInRecommendationsUrl = `${linkedInUrl}details/recommendations/`;

function EndorsementCard({
  endorsement,
  index,
  totalCount,
  linkedInUrl,
  messages,
  locale,
  duplicate = false,
}: {
  endorsement: (typeof endorsements)[number];
  index: number;
  totalCount: number;
  linkedInUrl: string;
  messages: Messages['endorsements'];
  locale: Locale;
  duplicate?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const quoteLong = endorsement.quote.length > 180;
  const longTextLocales = new Set<Locale>(['es', 'it', 'de', 'ja', 'zh']);
  const lineClampClass = longTextLocales.has(locale) ? 'line-clamp-5' : 'line-clamp-4';

  return (
    <div
      role={duplicate ? undefined : 'group'}
      aria-roledescription={duplicate ? undefined : 'slide'}
      aria-label={duplicate ? undefined : `${index + 1} of ${totalCount}`}
      aria-hidden={duplicate || undefined}
      inert={duplicate || undefined}
      className="w-[85vw] shrink-0 px-3 md:w-[400px]"
    >
      <Card
        variant="plate"
        className="group hover:border-gold/40 relative overflow-hidden transition-all duration-300"
      >
        <div className="relative">
          <Quote className="text-gold/30 group-hover:text-gold/40 absolute -top-1 right-2 h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
          <blockquote className="text-bark relative pr-8 text-base leading-relaxed">
            <AnimatePresence mode="wait">
              {quoteLong && !expanded ? (
                <m.p
                  key="short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={lineClampClass}
                >
                  {endorsement.quote}
                </m.p>
              ) : (
                <m.p
                  key="full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {endorsement.quote}
                </m.p>
              )}
            </AnimatePresence>
          </blockquote>
          {quoteLong && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="text-gold-deep hover:text-bark focus-visible:ring-gold mt-2 flex min-h-11 touch-manipulation items-center gap-1 rounded px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {expanded ? (
                <>
                  {messages.showLess} <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  {messages.readMore} <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
          <div className="border-bark/10 mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-4">
            <cite className="text-forest font-semibold not-italic">{endorsement.author}</cite>
            {endorsement.role && <span className="text-slate text-sm">— {endorsement.role}</span>}
            {endorsement.context && (
              <span className="text-slate block w-full text-xs">{endorsement.context}</span>
            )}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={messages.viewOnLinkedInAria}
              className="text-gold-deep hover:text-bark focus-visible:ring-gold focus-visible:ring-offset-parchment mt-2 inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <LinkedinIcon className="h-4 w-4" />
              {messages.viewOnLinkedIn}
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function Endorsements() {
  const { locale, messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const scrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const totalCount = endorsements.length;
  const duplicatedEndorsements = [...endorsements, ...endorsements];

  return (
    <Section variant="light" id="endorsements" tone="cool" nature={{ leaves: true }}>
      <div ref={ref}>
        <AnimatedHeading
          sectionId="endorsements"
          subtitle={`IIc · ${messages.kickers.endorsements}`}
          className="mb-4"
        >
          {messages.sections.endorsements}
        </AnimatedHeading>
        <p className="text-bark mb-6 max-w-2xl text-lg">{messages.endorsements.intro}</p>
        <m.p
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={trailFadeUp}
          className="mb-10"
        >
          <a
            href={linkedInRecommendationsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={messages.endorsements.viewAllOnLinkedInAria}
            className="text-gold-deep hover:text-bark focus-visible:ring-gold inline-flex items-center gap-2 rounded font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <LinkedinIcon className="h-5 w-5" />
            {messages.endorsements.viewAllOnLinkedIn}
          </a>
        </m.p>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={messages.sections.endorsements}
          className="relative"
        >
          {/* Desktop: auto-scrolling marquee */}
          <div className="hidden overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] md:block">
            <div
              className="flex focus-within:[animation-play-state:paused] hover:[animation-play-state:paused]"
              style={{
                animation: prefersReducedMotion
                  ? 'none'
                  : 'endorsement-marquee 40s linear infinite',
              }}
            >
              {duplicatedEndorsements.map((endorsement, i) => (
                <EndorsementCard
                  key={`${endorsement.id}-${i}`}
                  endorsement={endorsement}
                  index={i % totalCount}
                  totalCount={totalCount}
                  linkedInUrl={linkedInRecommendationsUrl}
                  messages={messages.endorsements}
                  locale={locale}
                  duplicate={i >= totalCount}
                />
              ))}
            </div>
          </div>

          {/* Mobile: horizontal scroll with snap */}
          <div
            ref={scrollRef}
            className="-mx-4 flex snap-x snap-mandatory scrollbar-none gap-0 overflow-x-auto px-4 md:hidden"
          >
            {endorsements.map((endorsement, i) => (
              <div key={endorsement.id} className="snap-center">
                <EndorsementCard
                  endorsement={endorsement}
                  index={i}
                  totalCount={totalCount}
                  linkedInUrl={linkedInRecommendationsUrl}
                  messages={messages.endorsements}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
