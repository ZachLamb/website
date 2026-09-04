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
  it('renders "What I Bring" heading', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('What I Bring')).toBeInTheDocument();
  });

  it('renders all 4 service titles', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('Full-Stack Architecture & Delivery')).toBeInTheDocument();
    expect(screen.getByText('AI-Augmented Engineering')).toBeInTheDocument();
    expect(screen.getByText('Product & Roadmap Strategy')).toBeInTheDocument();
    expect(screen.getByText('Process & Delivery')).toBeInTheDocument();
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
