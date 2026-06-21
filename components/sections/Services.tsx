'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Code, Sparkles, Users, Palette, Compass } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { services } from '@/data/services';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  sparkles: Sparkles,
  users: Users,
  palette: Palette,
  compass: Compass,
};

function CodeBracketsIllustration() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 opacity-[0.08]" aria-hidden>
      <path d="M25 15 L10 40 L25 65" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M55 15 L70 40 L55 65" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="10" x2="45" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

function SparkleIllustration() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 opacity-[0.08]" aria-hidden>
      <path d="M40 5 L43 35 L75 40 L43 45 L40 75 L37 45 L5 40 L37 35 Z" fill="currentColor" />
      <circle cx="60" cy="15" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="20" cy="65" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function ConnectedUsersIllustration() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 opacity-[0.08]" aria-hidden>
      <circle cx="20" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="60" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="27" y1="34" x2="33" y2="54" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="53" y1="34" x2="47" y2="54" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="28" y1="30" x2="52" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function PaletteIllustration() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 opacity-[0.08]" aria-hidden>
      <path d="M40 10 C55 10 70 25 70 40 C70 55 55 70 40 70 C25 70 10 55 10 40 C10 25 25 10 40 10" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="28" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="55" cy="45" r="3.5" fill="currentColor" opacity="0.45" />
      <circle cx="35" cy="52" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function CompassIllustration() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 opacity-[0.08]" aria-hidden>
      <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.5" />
      <path d="M40 12 L43 37 L40 35 L37 37 Z" fill="currentColor" opacity="0.6" />
      <path d="M40 68 L43 43 L40 45 L37 43 Z" fill="currentColor" opacity="0.3" />
      <line x1="12" y1="40" x2="68" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

const illustrationMap: Record<string, React.FC> = {
  code: CodeBracketsIllustration,
  sparkles: SparkleIllustration,
  users: ConnectedUsersIllustration,
  palette: PaletteIllustration,
  compass: CompassIllustration,
};

export function Services() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="light" id="services" tone="dusk" mapFrame nature={{ leaves: true }}>
      <AnimatedHeading sectionId="services" subtitle="IV.">
        {messages.sections.services}
      </AnimatedHeading>

      <div ref={ref} className="mt-12 space-y-12">
        {services.map((service, i) => {
          const Icon = iconMap[service.icon];
          const Illustration = illustrationMap[service.icon];
          const isEven = i % 2 === 0;

          return (
            <m.div
              key={service.id}
              initial={{ opacity: 0, x: isEven ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -30 : 30 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-start gap-6 md:flex-row md:items-center"
            >
              {/* Icon + illustration side */}
              <div className={cn(
                'flex shrink-0 items-center gap-4',
                !isEven && 'md:order-2',
              )}>
                <div className="bg-gold/10 flex h-12 w-12 items-center justify-center rounded-full">
                  {Icon && <Icon className="text-gold h-6 w-6" />}
                </div>
                {Illustration && (
                  <div className="text-bark hidden md:block">
                    <Illustration />
                  </div>
                )}
              </div>

              {/* Text side */}
              <div className={cn(!isEven && 'md:order-1 md:text-right')}>
                <h3 className="text-forest font-serif text-xl font-semibold">{service.title}</h3>
                <p className="text-bark mt-2 max-w-md text-sm">{service.description}</p>
              </div>
            </m.div>
          );
        })}
      </div>
    </Section>
  );
}
