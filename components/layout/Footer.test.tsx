vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: (props: any) => <path {...props} />,
  },
  useInView: () => true,
}));

import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders End of Trail marker', () => {
    render(<Footer />);
    expect(screen.getByText('End of Trail')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© \d{4} Zach Lamb/)).toBeInTheDocument();
  });

  it('renders Back to top link', () => {
    render(<Footer />);
    const backToTop = screen.getByRole('link', { name: /back to top/i });
    expect(backToTop).toBeInTheDocument();
    expect(backToTop).toHaveAttribute('href', '#hero');
  });

  it('renders GitHub link with accessible label', () => {
    render(<Footer />);
    expect(screen.getByLabelText(/GitHub/i)).toBeInTheDocument();
  });

  it('renders LinkedIn link with accessible label', () => {
    render(<Footer />);
    expect(screen.getByLabelText(/LinkedIn/i)).toBeInTheDocument();
  });
});
