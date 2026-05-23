import { render } from '@testing-library/react';
import { vi } from 'vitest';
import {
  BirdSilhouettes,
  Fireflies,
  FloatingLeaves,
  MistLayer,
  PineTreeSilhouette,
} from './NatureElements';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  const stripMotionProps = ({
    animate,
    transition,
    initial: _initial,
    exit: _exit,
    variants: _variants,
    whileHover: _whileHover,
    whileTap: _whileTap,
    whileInView: _whileInView,
    ...rest
  }: any) => ({
    rest,
    motionProps: { animate, transition },
  });
  const factories = {
    div: (props: any) => {
      const { rest, motionProps } = stripMotionProps(props);
      return (
        <div
          {...rest}
          data-animate={JSON.stringify(motionProps.animate ?? null)}
          data-transition={JSON.stringify(motionProps.transition ?? null)}
        >
          {rest.children}
        </div>
      );
    },
    span: (props: any) => {
      const { rest } = stripMotionProps(props);
      return <span {...rest}>{rest.children}</span>;
    },
  };
  return {
    ...actual,
    motion: factories,
    m: factories,
    LazyMotion: ({ children }: { children: React.ReactNode }) => children,
    useReducedMotion: vi.fn(() => false),
  };
});

// Import after mock so our mocked useReducedMotion is the reference we control.
const { useReducedMotion } = await import('framer-motion');
const mockedUseReducedMotion = vi.mocked(useReducedMotion);

describe('NatureElements reduced-motion handling', () => {
  beforeEach(() => {
    mockedUseReducedMotion.mockReturnValue(false);
  });

  describe('FloatingLeaves', () => {
    it('returns null when reduced motion is preferred', () => {
      mockedUseReducedMotion.mockReturnValue(true);
      const { container } = render(<FloatingLeaves count={8} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders leaves when reduced motion is not preferred', () => {
      mockedUseReducedMotion.mockReturnValue(false);
      const { container } = render(<FloatingLeaves count={4} />);
      expect(container.firstChild).not.toBeNull();
      expect(container.querySelectorAll('svg').length).toBe(4);
    });
  });

  describe('BirdSilhouettes', () => {
    it('returns null when reduced motion is preferred', () => {
      mockedUseReducedMotion.mockReturnValue(true);
      const { container } = render(<BirdSilhouettes count={3} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders birds when reduced motion is not preferred', () => {
      mockedUseReducedMotion.mockReturnValue(false);
      const { container } = render(<BirdSilhouettes count={3} />);
      expect(container.firstChild).not.toBeNull();
      expect(container.querySelectorAll('svg').length).toBe(3);
    });
  });

  describe('Fireflies', () => {
    it('returns null when reduced motion is preferred', () => {
      mockedUseReducedMotion.mockReturnValue(true);
      const { container } = render(<Fireflies count={12} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders fireflies when reduced motion is not preferred', () => {
      mockedUseReducedMotion.mockReturnValue(false);
      const { container } = render(<Fireflies count={6} />);
      expect(container.firstChild).not.toBeNull();
      // Fireflies are rendered as divs, one per dot.
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.querySelectorAll('div').length).toBe(6);
    });
  });

  describe('MistLayer', () => {
    it('renders a static gradient (no animate keyframes) when reduced motion is preferred', () => {
      mockedUseReducedMotion.mockReturnValue(true);
      const { container } = render(<MistLayer />);
      // Wrapper still renders so the gradient remains visible; it is just not animated.
      expect(container.firstChild).not.toBeNull();
      // MistLayer now uses a plain div with CSS animation; when reduced motion is
      // preferred the animation style property is set to 'none'.
      const gradient = container.querySelector('.h-32') as HTMLElement | null;
      expect(gradient).not.toBeNull();
      expect(gradient?.style.animation).toBe('none');
    });

    it('renders the animating gradient when reduced motion is not preferred', () => {
      mockedUseReducedMotion.mockReturnValue(false);
      const { container } = render(<MistLayer />);
      expect(container.firstChild).not.toBeNull();
      // MistLayer now uses CSS animation; the animation style should reference the
      // mist-breathe keyframe.
      const gradient = container.querySelector('.h-32') as HTMLElement | null;
      expect(gradient).not.toBeNull();
      expect(gradient?.style.animation).toContain('mist-breathe');
    });
  });

  describe('PineTreeSilhouette', () => {
    // PineTreeSilhouette has no motion animation; included for completeness.
    it('renders regardless of reduced motion preference', () => {
      mockedUseReducedMotion.mockReturnValue(true);
      const { container } = render(<PineTreeSilhouette />);
      expect(container.querySelector('svg')).not.toBeNull();
    });
  });
});
