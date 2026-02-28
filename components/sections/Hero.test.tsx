vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
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
  },
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  AnimatePresence: ({ children }: any) => children,
}));

import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders "Zach Lamb" heading', () => {
    render(<Hero />);
    expect(screen.getByText('Zach Lamb')).toBeInTheDocument();
  });

  it('renders "Senior Software Engineer" subtitle', () => {
    render(<Hero />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('renders "Begin the Journey" CTA', () => {
    render(<Hero />);
    expect(screen.getByText('Begin the Journey')).toBeInTheDocument();
  });

  it('renders "Leave a Note at Camp" CTA', () => {
    render(<Hero />);
    expect(screen.getByText('Leave a Note at Camp')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Hero />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });
});
