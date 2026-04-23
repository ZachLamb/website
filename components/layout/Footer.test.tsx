vi.mock('framer-motion', () => {
  const factories = {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: (props: any) => <path {...props} />,
  };
  return {
    motion: factories,
    m: factories,
    useInView: () => true,
    LazyMotion: ({ children }: any) => children,
    domAnimation: {},
  };
});

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders End of Trail marker', () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText('End of Trail')).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText(/© \d{4} Zach Lamb/)).toBeInTheDocument();
  });

  it('renders Back to top link', () => {
    renderWithLocale(<Footer />);
    const backToTop = screen.getByRole('link', { name: /back to top/i });
    expect(backToTop).toBeInTheDocument();
    expect(backToTop.getAttribute('href')).toMatch(/#hero$/);
  });

  it('renders GitHub link with accessible label', () => {
    renderWithLocale(<Footer />);
    expect(screen.getByLabelText(/GitHub/i)).toBeInTheDocument();
  });

  it('renders LinkedIn link with accessible label', () => {
    renderWithLocale(<Footer />);
    expect(screen.getByLabelText(/LinkedIn/i)).toBeInTheDocument();
  });
});
