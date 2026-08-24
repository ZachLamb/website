'use client';

import { useRef, useState } from 'react';
import { m, useInView, AnimatePresence } from 'framer-motion';
import { GraduationCap, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { Badge } from '@/components/ui/Badge';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { education, certifications } from '@/data/education';
import { trailFadeUp, waypointPop } from '@/lib/trail-animations';

function EducationRow({
  entry,
  index,
  isInView,
}: {
  entry: (typeof education)[number];
  index: number;
  isInView: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = entry.details.length > 0;

  return (
    <m.div
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={trailFadeUp}
      transition={{ delay: index * 0.1 }}
    >
      <button
        type="button"
        onClick={() => hasDetails && setExpanded((e) => !e)}
        disabled={!hasDetails}
        className="group hover:bg-sand/50 flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors disabled:cursor-default disabled:hover:bg-transparent"
      >
        <GraduationCap className="text-gold h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-forest-deep font-serif text-lg font-semibold">
              {entry.degree}
            </span>
            <span className="text-bark text-sm" aria-hidden>
              —
            </span>
            <span className="text-bark text-sm">{entry.institution}</span>
            {entry.field && <Badge className="text-xs">{entry.field}</Badge>}
          </div>
        </div>
        <span className="text-stone shrink-0 text-xs tabular-nums">
          {entry.startYear}–{entry.endYear}
        </span>
        {hasDetails && (
          <span className="text-gold shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        )}
      </button>

      <AnimatePresence>
        {expanded && hasDetails && (
          <m.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-bark list-inside list-disc space-y-1 overflow-hidden pl-10 text-sm"
          >
            {entry.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export function Education() {
  const { messages } = useLocaleContext();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Section variant="light" id="education" tone="dusk" nature={{ leaves: true, pines: true }}>
      <AnimatedHeading sectionId="education" subtitle={`V · ${messages.kickers.education}`}>
        {messages.sections.education}
      </AnimatedHeading>

      <div ref={ref} className="divide-bark/10 mt-8 divide-y">
        {education.map((entry, i) => (
          <EducationRow key={entry.id} entry={entry} index={i} isInView={isInView} />
        ))}
      </div>

      {/* Certifications as horizontal chips */}
      <div className="mt-8">
        <h3 className="text-forest mb-4 font-serif text-lg font-semibold">
          {messages.education.certifications}
        </h3>
        <div className="flex flex-wrap gap-3">
          {certifications.map((cert, i) => (
            <m.div
              key={cert.id}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={waypointPop}
              transition={{ delay: education.length * 0.06 + i * 0.06 }}
              className="border-bark/15 inline-flex items-center gap-2 rounded-full border bg-white/40 px-3 py-1.5"
            >
              <Award className="text-gold h-4 w-4 shrink-0" />
              <span className="text-bark text-sm font-medium">{cert.name}</span>
              {cert.issuer && <span className="text-stone text-xs">· {cert.issuer}</span>}
            </m.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
