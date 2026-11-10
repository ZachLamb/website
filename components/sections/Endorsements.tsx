'use client';

import { useRef, useState } from 'react';
import { m, useInView, AnimatePresence } from 'framer-motion';
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
  messages,
  locale,
  layout,
}: {
  endorsement: (typeof endorsements)[number];
  index: number;
  totalCount: number;
  messages: Messages['endorsements'];
  locale: Locale;
  /** `slide`: fixed-width carousel card with a clamped quote. `grid`: fills its column, full quote. */
  layout: 'slide' | 'grid';
}) {
  const [expanded, setExpanded] = useState(false);
  const isSlide = layout === 'slide';
  // Only the carousel clamps: a slide has to stay short enough to swipe
  // past, while the desktop grid has room to show each quote whole.
  const quoteLong = isSlide && endorsement.quote.length > 180;
  const longTextLocales = new Set<Locale>(['es', 'it', 'de', 'ja', 'zh']);
  const lineClampClass = longTextLocales.has(locale) ? 'line-clamp-5' : 'line-clamp-4';

  return (
    <div
      role={isSlide ? 'group' : undefined}
      aria-roledescription={isSlide ? 'slide' : undefined}
      aria-label={isSlide ? `${index + 1} of ${totalCount}` : undefined}
      className={isSlide ? 'w-[85vw] shrink-0 px-3 sm:w-[340px]' : 'h-full'}
    >
      <Card
        variant="plate"
        className="group hover:border-gold/40 relative flex h-full flex-col overflow-hidden transition-all duration-300"
      >
        <Quote
          aria-hidden="true"
          className="text-gold/30 group-hover:text-gold/40 mb-3 h-8 w-8 shrink-0 transition-colors duration-300"
        />
        <blockquote className="text-bark relative flex-1 text-base leading-relaxed">
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
            className="text-gold-deep hover:text-bark focus-visible:ring-gold mt-2 -ml-2 flex min-h-11 touch-manipulation items-center gap-1 self-start rounded px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
        <div className="border-bark/10 mt-4 border-t pt-4">
          <cite className="text-forest block font-semibold not-italic">{endorsement.author}</cite>
          {endorsement.role && <span className="text-slate block text-sm">{endorsement.role}</span>}
          {endorsement.context && (
            <span className="text-slate mt-1 block text-xs">{endorsement.context}</span>
          )}
        </div>
      </Card>
    </div>
  );
}

export function Endorsements() {
  const { locale, messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const totalCount = endorsements.length;

  return (
    <Section variant="light" id="endorsements" tone="cool" nature={{ leaves: true }}>
      <div ref={ref}>
        <AnimatedHeading
          sectionId="endorsements"
          subtitle={`IV · ${messages.kickers.endorsements}`}
          className="mb-4"
        >
          {messages.sections.endorsements}
        </AnimatedHeading>
        <p className="text-bark mb-10 max-w-2xl text-lg">{messages.endorsements.intro}</p>

        {/* lg and up: every recommendation side by side, quoted in full. */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-3">
          {endorsements.map((endorsement, i) => (
            <m.div
              key={endorsement.id}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={trailFadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <EndorsementCard
                endorsement={endorsement}
                index={i}
                totalCount={totalCount}
                messages={messages.endorsements}
                locale={locale}
                layout="grid"
              />
            </m.div>
          ))}
        </div>

        {/* Below lg: swipeable carousel with snap */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={messages.sections.endorsements}
          className="-mx-4 flex snap-x snap-mandatory scrollbar-none overflow-x-auto px-1 sm:-mx-6 sm:px-3 lg:hidden"
        >
          {endorsements.map((endorsement, i) => (
            <div key={endorsement.id} className="snap-center">
              <EndorsementCard
                endorsement={endorsement}
                index={i}
                totalCount={totalCount}
                messages={messages.endorsements}
                locale={locale}
                layout="slide"
              />
            </div>
          ))}
        </div>

        <m.p
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={trailFadeUp}
          className="mt-8"
        >
          <a
            href={linkedInRecommendationsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={messages.endorsements.viewAllOnLinkedInAria}
            className="text-gold-deep hover:text-bark focus-visible:ring-gold inline-flex min-h-11 items-center gap-2 rounded font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <LinkedinIcon className="h-5 w-5" />
            {messages.endorsements.viewAllOnLinkedIn}
          </a>
        </m.p>
      </div>
    </Section>
  );
}
