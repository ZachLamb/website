vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Services } from './Services';

describe('Services', () => {
  it('renders "What I Do" heading', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('What I Do')).toBeInTheDocument();
  });

  it('renders all 4 service titles', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('Team Leadership')).toBeInTheDocument();
    expect(screen.getByText('Agile Delivery')).toBeInTheDocument();
    expect(screen.getByText('Product & Roadmap')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Features')).toBeInTheDocument();
  });

  it('has the services section id', () => {
    const { container } = renderWithLocale(<Services />);
    expect(container.querySelector('#services')).toBeInTheDocument();
  });

  it('renders services in a grid of plate cards, all left-aligned', () => {
    const { container } = renderWithLocale(<Services />);
    expect(container.querySelector('.md\\:grid-cols-2')).not.toBeNull();
    expect(container.querySelector('.md\\:text-right')).toBeNull();
    expect(container.querySelectorAll('.bg-white\\/40').length).toBeGreaterThanOrEqual(4);
  });
});
