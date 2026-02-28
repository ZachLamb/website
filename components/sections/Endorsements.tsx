'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import type { Messages } from '@/lib/i18n';
import { endorsements } from '@/data/endorsements';
import { siteConfig } from '@/data/site';

const linkedInRecommendationsUrl = `${siteConfig.links.linkedin}details/recommendations/`;

function EndorsementCard({
  endorsement,
  index,
  isInView,
  linkedInUrl,
  messages,
  locale,
}: {
  endorsement: (typeof endorsements)[number];
  index: number;
  isInView: boolean;
  linkedInUrl: string;
  messages: Messages['endorsements'];
  locale: import('@/lib/i18n').Locale;
}) {
  const [expanded, setExpanded] = useState(false);
  const quoteLong = endorsement.quote.length > 180;
  const longTextLocales = ['es', 'it', 'de', 'ja', 'zh'] as const;
  const lineClampClass = longTextLocales.includes(locale) ? 'line-clamp-5' : 'line-clamp-4';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Card className="group hover:border-gold/40 relative overflow-hidden transition-all duration-300">
        <div className="relative">
          <Quote className="text-gold/30 group-hover:text-gold/40 absolute -top-1 right-2 h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
          <blockquote className="text-bark relative pr-8 text-base leading-relaxed">
            <AnimatePresence mode="wait">
              {quoteLong && !expanded ? (
                <motion.p
                  key="short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={lineClampClass}
                >
                  {endorsement.quote}
                </motion.p>
              ) : (
                <motion.p
                  key="full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {endorsement.quote}
                </motion.p>
              )}
            </AnimatePresence>
          </blockquote>
          {quoteLong && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="text-gold hover:text-copper focus-visible:ring-gold mt-2 flex min-h-11 touch-manipulation items-center gap-1 rounded px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          <footer className="border-bark/10 mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t pt-4">
            <cite className="text-forest font-semibold not-italic">{endorsement.author}</cite>
            {endorsement.role && <span className="text-stone text-sm">— {endorsement.role}</span>}
            {endorsement.context && (
              <span className="text-stone/80 block w-full text-xs">{endorsement.context}</span>
            )}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={messages.viewOnLinkedInAria}
              className="text-gold hover:text-copper focus-visible:ring-gold focus-visible:ring-offset-parchment mt-2 inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Linkedin className="h-4 w-4" />
              {messages.viewOnLinkedIn}
            </a>
          </footer>
        </div>
      </Card>
    </motion.div>
  );
}

export function Endorsements() {
  const { locale, messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <Section variant="light" id="endorsements" nature={{ leaves: true }}>
      <div ref={ref}>
        <AnimatedHeading sectionId="endorsements" subtitle="IIa." className="mb-4">
          {messages.sections.endorsements}
        </AnimatedHeading>
        <p className="text-bark mb-6 max-w-2xl text-lg">{messages.endorsements.intro}</p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10"
        >
          <a
            href={linkedInRecommendationsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={messages.endorsements.viewAllOnLinkedInAria}
            className="text-gold hover:text-copper focus-visible:ring-gold inline-flex items-center gap-2 rounded font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Linkedin className="h-5 w-5" />
            {messages.endorsements.viewAllOnLinkedIn}
          </a>
        </motion.p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {endorsements.map((endorsement, i) => (
            <EndorsementCard
              key={endorsement.id}
              endorsement={endorsement}
              index={i}
              isInView={isInView}
              linkedInUrl={linkedInRecommendationsUrl}
              messages={messages.endorsements}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
