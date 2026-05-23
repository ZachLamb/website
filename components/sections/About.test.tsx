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

  it('renders bio text mentioning Circadence', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/Circadence/)).toBeInTheDocument();
  });

  it('renders bio text mentioning Technical Product Manager', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/Technical Product Manager/)).toBeInTheDocument();
  });

  it('has the about section id', () => {
    const { container } = renderWithLocale(<About />);
    expect(container.querySelector('#about')).toBeInTheDocument();
  });

  it('renders all paragraphs from messages.about.body array', () => {
    renderWithLocale(<About />);
    // The en.json about.body has 2 paragraphs — match one unique phrase from each
    expect(screen.getByText(/I'm a Technical Product Manager/)).toBeInTheDocument();
    expect(screen.getByText(/The engineering background is deliberate/)).toBeInTheDocument();
  });

  it('does not use aria-label on non-interactive paragraph elements', () => {
    renderWithLocale(<About />);
    const paragraphs = document.querySelectorAll('p[aria-label]');
    expect(paragraphs).toHaveLength(0);
  });
});
