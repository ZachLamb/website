// Hoisted motion-mock controller so individual tests can flip
// useReducedMotion's return value (e.g. to exercise the prefers-reduced-motion
// branch added in H2).
const { motionMocks } = vi.hoisted(() => ({
  motionMocks: { useReducedMotion: vi.fn(() => false) },
}));

vi.mock('framer-motion', () => {
  const factories = {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    path: (props: any) => <path {...props} />,
    rect: (props: any) => <rect {...props} />,
    g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
    ellipse: (props: any) => <ellipse {...props} />,
    circle: (props: any) => <circle {...props} />,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    create:
      (tag: string) =>
      ({ children, ...props }: any) => {
        const Tag = tag as any;
        return <Tag {...props}>{children}</Tag>;
      },
  };
  return {
    motion: factories,
    m: factories,
    useInView: () => true,
    useScroll: () => ({ scrollYProgress: { current: 0 } }),
    useReducedMotion: () => motionMocks.useReducedMotion(),
    AnimatePresence: ({ children }: any) => children,
    LazyMotion: ({ children }: any) => children,
    domAnimation: {},
  };
});

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Hero } from './Hero';

describe('Hero', () => {
  beforeEach(() => {
    motionMocks.useReducedMotion.mockReturnValue(false);
  });

  it('renders "Zach Lamb" heading', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText('Zach Lamb')).toBeInTheDocument();
  });

  it('renders "Senior Software Engineer" subtitle', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('renders "Get in Touch" primary CTA', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument();
  });

  it('renders "Learn More" secondary CTA', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
  });

  it('renders social links with accessible labels', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByLabelText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LinkedIn/i)).toBeInTheDocument();
  });

  it('renders cleanly under prefers-reduced-motion (trail-map static branch)', () => {
    // Smoke-test the H2 branch: every motion element in the trail-map must
    // skip its initial/animate/transition props yet still render at end-state.
    // We can't easily inspect framer-motion's inner state, but the static
    // branch has more conditional-spread sites than the motion branch — if
    // any one of them throws or mis-spreads, this render breaks.
    motionMocks.useReducedMotion.mockReturnValue(true);
    renderWithLocale(<Hero />);
    expect(screen.getByText('Zach Lamb')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument();
  });
});
