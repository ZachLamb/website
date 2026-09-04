vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { About } from './About';

describe('About', () => {
  it('renders "Trail Guide" heading', () => {
    renderWithLocale(<About />);
    expect(screen.getByText('Trail Guide')).toBeInTheDocument();
  });

  it('renders stats grid with 4 stat cards', () => {
    renderWithLocale(<About />);
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('Years Building')).toBeInTheDocument();
    expect(screen.getByText('CSM')).toBeInTheDocument();
    expect(screen.getByText('IC↔PM')).toBeInTheDocument();
  });

  it('renders bio text mentioning Lead Full-Stack Developer', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/Lead Full-Stack Developer/)).toBeInTheDocument();
  });

  it('has the about section id', () => {
    const { container } = renderWithLocale(<About />);
    expect(container.querySelector('#about')).toBeInTheDocument();
  });

  it('renders pull-quote and personal note', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/I'm a Lead Full-Stack Developer/)).toBeInTheDocument();
    expect(screen.getByText(/Oreo debate/)).toBeInTheDocument();
  });

  it('does not use aria-label on non-interactive paragraph elements', () => {
    renderWithLocale(<About />);
    const paragraphs = document.querySelectorAll('p[aria-label]');
    expect(paragraphs).toHaveLength(0);
  });

  it('renders stat tiles as map plates with gold-deep numerals', () => {
    renderWithLocale(<About />);
    const statValue = screen.getByText('10+');
    expect(statValue).toHaveClass('text-gold-deep', 'font-serif');
    // plate recipe applied to the tile container
    expect(statValue.closest('.bg-white\\/40')).not.toBeNull();
  });
});
