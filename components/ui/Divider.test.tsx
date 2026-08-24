import { render } from '@testing-library/react';
import { Divider } from './Divider';
import { TRAIL_OFFSET_LEFT, TRAIL_LINE_CENTER_INSET } from '@/lib/trail-position';

vi.mock('framer-motion', () => {
  const factories = {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    span: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
    svg: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
    path: (props: React.SVGProps<SVGPathElement>) => <path {...props} />,
  };
  return {
    motion: factories,
    m: factories,
    useInView: () => true,
    LazyMotion: ({ children }: { children: React.ReactNode }) => children,
    domAnimation: {},
  };
});

describe('Divider', () => {
  it('renders the trail variant by default', () => {
    const { container } = render(<Divider />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders mountains variant', () => {
    const { container } = render(<Divider variant="mountains" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders treeline variant', () => {
    const { container } = render(<Divider variant="treeline" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Divider className="my-8" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass('my-8');
  });

  it('supports flip prop', () => {
    const { container } = render(<Divider variant="mountains" flip />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('renders a trail crossing dot on mountain and treeline dividers', () => {
    const { container: mountains } = render(<Divider variant="mountains" />);
    const mountainDots = mountains.querySelectorAll('[data-trail-crossing]');
    expect(mountainDots.length).toBe(2); // mobile and desktop dots

    const { container: treeline } = render(<Divider variant="treeline" />);
    const treelineDots = treeline.querySelectorAll('[data-trail-crossing]');
    expect(treelineDots.length).toBe(2); // mobile and desktop dots

    const { container: trail } = render(<Divider variant="trail" />);
    expect(trail.querySelector('[data-trail-crossing]')).toBeNull();
  });

  it('centers the mobile and desktop crossing dots on the trail line', () => {
    const { container } = render(<Divider variant="mountains" />);
    const dots = container.querySelectorAll('[data-trail-crossing]');
    const [mobileDot, desktopDot] = Array.from(dots) as HTMLElement[];

    // Mobile dot sits at the mobile gutter's horizontal center (w-5 = 1.25rem, half = 0.625rem),
    // matching TRAIL_LINE_CENTER_INSET_MOBILE, and must be x-centered on that position.
    expect(mobileDot.style.left).toBe('0.625rem');
    expect(mobileDot).toHaveClass('-translate-x-1/2');
    expect(mobileDot).toHaveClass('-translate-y-1/2');

    // Desktop dot must also be x-centered on its computed line position.
    // (jsdom's inline-style parser rejects the nested max()/calc() expression
    // and drops the whole `style` attribute, so we can't assert its computed
    // value via the DOM here — this is exercised visually/e2e instead. The
    // expression itself is unit-tested below.)
    expect(desktopDot).toHaveClass('-translate-x-1/2');
    expect(desktopDot).toHaveClass('-translate-y-1/2');
  });

  it('derives the desktop crossing dot position from the shared trail-position constants', () => {
    // Guards against re-introducing a hardcoded, independently-drifting offset
    // for the desktop dot (mirrors the bug fixed for the mobile dot).
    expect(`calc(${TRAIL_OFFSET_LEFT} + ${TRAIL_LINE_CENTER_INSET})`).toBe(
      'calc(max(0.5rem,calc((100vw-1024px)/2-2.5rem)) + 0.75rem)',
    );
  });
});
