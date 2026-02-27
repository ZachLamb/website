vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
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
import { Services } from './Services';

describe('Services', () => {
  it('renders "Services at the Lodge" heading', () => {
    render(<Services />);
    expect(screen.getByText('Services at the Lodge')).toBeInTheDocument();
  });

  it('renders all 4 service titles', () => {
    render(<Services />);
    expect(screen.getByText('Frontend Engineering')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Web Tools')).toBeInTheDocument();
    expect(screen.getByText('Agile Coaching')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
  });

  it('has the services section id', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('#services')).toBeInTheDocument();
  });
});
