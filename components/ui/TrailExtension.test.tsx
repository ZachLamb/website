// Per-file framer-motion mock so individual tests can flip useReducedMotion
// and assert on the args passed to useTransform. This replaces the suite-wide
// default in vitest.setup.ts for this file only.

const { motionMocks } = vi.hoisted(() => ({
  motionMocks: {
    useReducedMotion: vi.fn(() => false),
    // Typed to accept the same shape as framer-motion's useTransform so the
    // toHaveBeenCalledWith assertions can inspect the input/output ranges.
    useTransform: vi.fn((..._args: unknown[]) => ({ current: 0 })),
  },
}));

vi.mock('framer-motion', () => {
  const factories = {
    path: (props: { [k: string]: unknown }) => <path {...props} />,
  };
  return {
    motion: factories,
    m: factories,
    useReducedMotion: () => motionMocks.useReducedMotion(),
    useScroll: () => ({ scrollYProgress: { current: 0 } }),
    useTransform: (...args: unknown[]) => motionMocks.useTransform(...args),
    LazyMotion: ({ children }: { children?: React.ReactNode }) => children,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    domAnimation: {},
  };
});

import { render } from '@testing-library/react';
import { TrailExtension } from './TrailExtension';

describe('TrailExtension', () => {
  beforeEach(() => {
    motionMocks.useReducedMotion.mockReturnValue(false);
    motionMocks.useTransform.mockClear();
  });

  it('renders an aria-hidden trail SVG with the dashed vertical path', () => {
    const { container } = render(<TrailExtension />);
    const wrapper = container.firstChild as HTMLElement;
    // aria-hidden — purely decorative; AT shouldn't read it.
    expect(wrapper).toHaveAttribute('aria-hidden');
    // Structural sanity: SVG with one path inside.
    expect(container.querySelector('svg')).toBeInTheDocument();
    const path = container.querySelector('svg path');
    expect(path).toBeInTheDocument();
    // Strengthened stroke — see lib/trail-position.ts for the shared gutter positioning.
    expect(path).toHaveAttribute('stroke', 'rgba(184,134,11,0.5)');
    expect(path).toHaveAttribute('stroke-width', '3');
  });

  it('renders cleanly under prefers-reduced-motion', () => {
    motionMocks.useReducedMotion.mockReturnValue(true);
    const { container } = render(<TrailExtension />);
    expect(container.querySelector('svg path')).toBeInTheDocument();
  });

  it('shows the whole dashed trail, not a scroll-drawn one, when reduced', () => {
    motionMocks.useReducedMotion.mockReturnValue(true);
    const { container } = render(<TrailExtension />);
    const path = container.querySelector('svg path');
    // No pathLength style: the dashes come straight from the attribute, so
    // the trail is fully visible at every scroll position.
    expect(path).not.toHaveAttribute('style');
    expect(path).toHaveAttribute('stroke-dasharray', '6 6');
  });

  it('passes a scroll-driven output range to useTransform by default', () => {
    render(<TrailExtension />);
    expect(motionMocks.useTransform).toHaveBeenCalledWith(
      expect.anything(),
      [0, 0.05, 0.5, 1],
      [0, 0.05, 0.5, 1],
    );
  });

  it('unmounts cleanly without throwing', () => {
    const { unmount } = render(<TrailExtension />);
    expect(() => unmount()).not.toThrow();
  });
});
