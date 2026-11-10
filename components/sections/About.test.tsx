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
  it('renders "About" heading', () => {
    renderWithLocale(<About />);
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
  });

  it('renders stats grid with 4 stat cards', () => {
    renderWithLocale(<About />);
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('Years Building')).toBeInTheDocument();
    expect(screen.getByText('CSM')).toBeInTheDocument();
    expect(screen.getByText('409→10')).toBeInTheDocument();
  });

  it('renders bio text mentioning the Lead UI Developer title', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/Lead UI Developer/)).toBeInTheDocument();
  });

  it('has the about section id', () => {
    const { container } = renderWithLocale(<About />);
    expect(container.querySelector('#about')).toBeInTheDocument();
  });

  it('renders pull-quote and personal note', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/I'm the Lead UI Developer at Circadence/)).toBeInTheDocument();
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
