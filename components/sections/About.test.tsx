vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    create:
      (tag: string) =>
      ({ children, ...props }: any) => {
        const Tag = tag as any;
        return <Tag {...props}>{children}</Tag>;
      },
  },
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { render, screen } from '@testing-library/react';
import { About } from './About';

describe('About', () => {
  it('renders "Trail Guide" heading', () => {
    render(<About />);
    expect(screen.getByText('Trail Guide')).toBeInTheDocument();
  });

  it('renders bio text mentioning Circadence', () => {
    render(<About />);
    expect(screen.getByText(/Circadence/)).toBeInTheDocument();
  });

  it('renders bio text mentioning frontend-leaning', () => {
    render(<About />);
    expect(screen.getByText(/frontend-leaning/)).toBeInTheDocument();
  });

  it('has the about section id', () => {
    const { container } = render(<About />);
    expect(container.querySelector('#about')).toBeInTheDocument();
  });
});
