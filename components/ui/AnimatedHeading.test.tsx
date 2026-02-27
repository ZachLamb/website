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
  AnimatePresence: ({ children }: any) => children,
}));

import { render, screen } from '@testing-library/react';
import { AnimatedHeading } from './AnimatedHeading';

describe('AnimatedHeading', () => {
  it('renders heading text', () => {
    render(<AnimatedHeading>Hello World</AnimatedHeading>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders as h2 by default', () => {
    render(<AnimatedHeading>Default Heading</AnimatedHeading>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Default Heading');
  });

  it('renders subtitle when provided', () => {
    render(<AnimatedHeading subtitle="Subtitle text">Main</AnimatedHeading>);
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedHeading className="text-center">Centered</AnimatedHeading>,
    );
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass('text-center');
  });
});
