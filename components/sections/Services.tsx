'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { Code, Sparkles, Users, Palette, Compass } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { services } from '@/data/services';
import { trailFadeUp } from '@/lib/trail-animations';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  sparkles: Sparkles,
  users: Users,
  palette: Palette,
  compass: Compass,
};

export function Services() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="light" id="services" tone="dusk" mapFrame nature={{ leaves: true }}>
      <AnimatedHeading sectionId="services" subtitle={`IV · ${messages.kickers.services}`}>
        {messages.sections.services}
      </AnimatedHeading>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((service, i) => {
          const Icon = iconMap[service.icon];

          return (
            <m.div
              key={service.id}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={trailFadeUp}
              transition={{ delay: i * 0.06 }}
            >
              <Card variant="plate" className="h-full">
                <div className="bg-gold/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  {Icon && <Icon className="text-gold-deep h-6 w-6" />}
                </div>
                <h3 className="text-forest-deep font-serif text-xl font-semibold">
                  {service.title}
                </h3>
                <p className="text-bark mt-2 text-sm">{service.description}</p>
              </Card>
            </m.div>
          );
        })}
      </div>
    </Section>
  );
}
