vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: (props: any) => <path {...props} />,
    create:
      (tag: string) =>
      ({ children, ...props }: any) => {
        const Tag = tag as any;
        return <Tag {...props}>{children}</Tag>;
      },
  },
  useInView: () => true,
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
}));

import { render, screen } from '@testing-library/react';
import { Endorsements } from './Endorsements';

describe('Endorsements', () => {
  it('renders "Trail Recommendations" heading', () => {
    render(<Endorsements />);
    expect(screen.getByText('Trail Recommendations')).toBeInTheDocument();
  });

  it('renders link to LinkedIn recommendations', () => {
    render(<Endorsements />);
    const link = screen.getByText(/View recommendations & endorsements on LinkedIn/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders endorsement cards from data', () => {
    render(<Endorsements />);
    expect(screen.getAllByText('Colleague Name').length).toBeGreaterThanOrEqual(1);
  });

  it('has the endorsements section id', () => {
    const { container } = render(<Endorsements />);
    expect(container.querySelector('#endorsements')).toBeInTheDocument();
  });
});
