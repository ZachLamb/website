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
import { Education } from './Education';

describe('Education', () => {
  it('renders "Ranger Credentials" heading', () => {
    render(<Education />);
    expect(screen.getByText('Ranger Credentials')).toBeInTheDocument();
  });

  it('renders CU Boulder', () => {
    render(<Education />);
    expect(screen.getByText('University of Colorado Boulder')).toBeInTheDocument();
  });

  it('renders Front Range Community College', () => {
    render(<Education />);
    expect(screen.getByText('Front Range Community College')).toBeInTheDocument();
  });

  it('renders CSM certification', () => {
    render(<Education />);
    expect(screen.getByText('Certified ScrumMaster (CSM)')).toBeInTheDocument();
  });

  it('has the education section id', () => {
    const { container } = render(<Education />);
    expect(container.querySelector('#education')).toBeInTheDocument();
  });
});
