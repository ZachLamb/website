vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: (props: any) => <path {...props} />,
    circle: (props: any) => <circle {...props} />,
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
import { Experience } from './Experience';

describe('Experience', () => {
  it('renders "Trail Log" heading', () => {
    render(<Experience />);
    expect(screen.getByText('Trail Log')).toBeInTheDocument();
  });

  it('renders all 10 company names', () => {
    render(<Experience />);
    const companies = [
      'Circadence',
      'Starbucks',
      'StellarFi',
      'Sana Benefits',
      'Purple',
      'The Regis Company',
      'Charter Communications',
      'Freelance Designer',
      'Lab for Playful Computation',
      'CU Boulder IT / MCDB',
    ];
    for (const company of companies) {
      expect(screen.getAllByText(company).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('has the experience section id', () => {
    const { container } = render(<Experience />);
    expect(container.querySelector('#experience')).toBeInTheDocument();
  });
});
