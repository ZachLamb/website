'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { skillCategories } from '@/data/skills';
import { waypointNumber } from '@/lib/waypoints';
import { cn } from '@/lib/utils';

type Tier = 'primary' | 'working' | 'emerging';

const tierOf = (years: number): Tier =>
  years >= 5 ? 'primary' : years <= 1 ? 'emerging' : 'working';

const chipClass: Record<Tier, string> = {
  primary: 'border-blaze-bright/70 bg-blaze-bright/10 text-paper font-medium',
  working: 'border-paper/25 text-paper/90',
  emerging: 'border-paper/15 text-stone border-dashed',
};

/** Key to the three chip styles. Symbols and numbers only, so it needs no
    translation. */
const legend: { tier: Tier; label: string }[] = [
  { tier: 'primary', label: '5y+' },
  { tier: 'working', label: '2–4y' },
  { tier: 'emerging', label: '≤1y' },
];

export function Skills() {
  const { messages } = useLocaleContext();

  return (
    <Section id="skills" surface="night" after="meadow">
      <SectionHeading
        sectionId="skills"
        number={waypointNumber('skills')}
        kicker={messages.kickers.skills}
        onNight
      >
        {messages.sections.skills}
      </SectionHeading>

      <p className="text-stone mt-4 max-w-2xl text-lg">{messages.skills.intro}</p>

      <ul
        aria-hidden="true"
        data-skill-legend
        className="text-stone mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs"
      >
        {legend.map(({ tier, label }) => (
          <li key={tier} className="flex items-center gap-2">
            <span className={cn('h-3.5 w-6 rounded-sm border', chipClass[tier])} />
            {label}
          </li>
        ))}
      </ul>

      <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {skillCategories.map((category, i) => (
          <Reveal key={category.id} delay={i * 0.05}>
            <h3 className="text-blaze-bright flex items-center gap-3 font-mono text-xs font-medium tracking-[0.18em] uppercase">
              {category.name}
              <span aria-hidden="true" className="bg-paper/20 h-px flex-1" />
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.name}
                  data-tier={tierOf(skill.years)}
                  className={cn(
                    'flex items-baseline gap-2 rounded-sm border px-2.5 py-1.5 text-sm',
                    chipClass[tierOf(skill.years)],
                  )}
                >
                  {skill.name}
                  <span className="font-mono text-xs opacity-75">{skill.years}y</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
