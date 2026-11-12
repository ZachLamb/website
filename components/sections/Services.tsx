'use client';

import { Code, Repeat, Users, Compass } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { services } from '@/data/services';
import { waypointNumber } from '@/lib/waypoints';

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  repeat: Repeat,
  users: Users,
  compass: Compass,
};

export function Services() {
  const { messages } = useLocaleContext();

  return (
    <Section id="services" surface="meadow" after="paper">
      <SectionHeading
        sectionId="services"
        number={waypointNumber('services')}
        kicker={messages.kickers.services}
      >
        {messages.sections.services}
      </SectionHeading>

      {/* A map legend: one ruled plate, each entry keyed by its symbol.
          Rules come from 1px gaps over the plate's border colour. */}
      <Reveal className="mt-8 md:mt-10">
        <Card className="bg-contour/40 grid grid-cols-1 gap-px overflow-hidden md:grid-cols-2">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <div key={service.id} className="bg-paper-raised flex gap-4 p-5 sm:p-6">
                <div
                  aria-hidden="true"
                  className="border-blaze/50 text-blaze flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border"
                >
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-ink font-serif text-xl leading-tight font-semibold sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="text-ink-soft mt-2 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </Card>
      </Reveal>
    </Section>
  );
}
