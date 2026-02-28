'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Sparkles, Users, Palette } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Card } from '@/components/ui/Card';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { services } from '@/data/services';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  sparkles: Sparkles,
  users: Users,
  palette: Palette,
};

export function Services() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="light" id="services" mapFrame nature={{ leaves: true }}>
      <AnimatedHeading sectionId="services" subtitle="IV.">
        {messages.sections.services}
      </AnimatedHeading>

      <div ref={ref} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((service, i) => {
          const Icon = iconMap[service.icon];

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card variant="map" className="group">
                <div className="bg-gold/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                  {Icon && <Icon className="text-gold h-6 w-6" />}
                </div>
                <h3 className="text-forest font-serif text-xl font-semibold">{service.title}</h3>
                <p className="text-bark mt-2 text-sm">{service.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
