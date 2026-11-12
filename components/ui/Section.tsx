import { cn } from '@/lib/utils';

export type Surface = 'paper' | 'meadow' | 'night';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** paper and meadow are the light map sheet; night is the dark one. */
  surface?: Surface;
  /**
   * The surface of the section directly above. When it differs in lightness
   * the top edge is drawn as a ridgeline in that colour; between two light
   * sections it is a ticked map neatline. Omit for no top edge.
   */
  after?: Surface;
}

const surfaceClass: Record<Surface, string> = {
  paper: 'bg-paper topo-paper text-ink',
  meadow: 'bg-meadow topo-paper text-ink',
  night: 'bg-night topo-night text-paper',
};

const fillClass: Record<Surface, string> = {
  paper: 'fill-paper',
  meadow: 'fill-meadow',
  night: 'fill-night',
};

/** The section above, hanging into this one as a ridge silhouette. */
function Ridge({ from }: { from: Surface }) {
  return (
    <svg
      aria-hidden="true"
      data-ridge={from}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      // -top-px: without the overlap a hairline of this section's colour
      // shows above the ridge at fractional zoom levels.
      className={cn(
        'absolute inset-x-0 -top-px block h-[clamp(18px,4.5vw,40px)] w-full',
        fillClass[from],
      )}
    >
      <path d="M0 0H1200V14L1130 26L1050 12L960 30L880 18L790 34L700 16L610 28L520 10L430 30L340 20L250 36L160 18L80 28L0 12Z" />
    </svg>
  );
}

export function Section({ id, children, className, surface = 'paper', after }: SectionProps) {
  const isNight = surface === 'night';
  const edge =
    after === undefined ? 'none' : (after === 'night') !== isNight ? 'ridge' : 'neatline';

  return (
    <section
      id={id}
      // tabIndex=-1 makes the section programmatically focusable so hash-jump
      // navigation (e.g. #skills) can move keyboard focus to the landmark.
      // It is an anchor target, not a tab stop, so it gets no focus ring;
      // focusable children keep their own.
      tabIndex={-1}
      aria-labelledby={id ? `${id}-heading` : undefined}
      data-surface={surface}
      className={cn(
        'relative py-14 focus:outline-none sm:py-20 md:py-24',
        surfaceClass[surface],
        edge === 'ridge' && 'pt-20 sm:pt-28 md:pt-32',
        className,
      )}
    >
      {edge === 'ridge' && after && <Ridge from={after} />}
      {edge === 'neatline' && (
        <div aria-hidden="true" data-neatline className="neatline absolute inset-x-0 top-0" />
      )}
      <div className="relative mx-auto max-w-5xl min-w-0 px-5 sm:px-6">{children}</div>
    </section>
  );
}
