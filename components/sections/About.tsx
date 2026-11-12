'use client';

import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { useLocaleContext } from '@/components/providers/LocaleProvider';
import { waypointNumber } from '@/lib/waypoints';

export function About() {
  const { messages } = useLocaleContext();
  const statement = messages.about.body[0] ?? '';

  return (
    <Section id="about" surface="paper" after="paper">
      <SectionHeading
        sectionId="about"
        number={waypointNumber('about')}
        kicker={messages.kickers.about}
      >
        {messages.about.heading}
      </SectionHeading>

      {/* Two columns from lg up: the statement on the left, the stat board
          on the right. Below lg the board drops under the statement. */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-12">
        <Reveal>
          <p className="text-ink text-lg leading-relaxed break-words sm:text-xl">{statement}</p>
          <p className="text-ink-soft border-contour/50 mt-6 border-l-2 pl-4 text-base italic">
            {messages.about.personalNote}
          </p>
        </Reveal>

        {/* Stats as one ruled board, like the figures on a trailhead sign.
            The 1px gaps show the board's border colour through as rules. */}
        <Reveal delay={0.08}>
          <Card className="bg-contour/40 grid grid-cols-2 gap-px overflow-hidden">
            {messages.about.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-paper-raised flex min-w-0 flex-col justify-center px-4 py-5 sm:px-5 sm:py-6"
              >
                <div className="text-blaze font-serif text-4xl leading-none font-bold whitespace-nowrap lining-nums">
                  {stat.value}
                </div>
                <div className="text-ink-soft mt-2 font-mono text-[11px] leading-snug tracking-wider break-words uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
