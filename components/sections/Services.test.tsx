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
  it('renders "How I Work" heading', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('How I Work')).toBeInTheDocument();
  });

  it('renders all 4 service titles', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('Technical Product Strategy')).toBeInTheDocument();
    expect(screen.getByText('AI-Augmented Engineering')).toBeInTheDocument();
    expect(screen.getByText('Process & Delivery')).toBeInTheDocument();
    expect(screen.getByText('Engineering ↔ Product Bridge')).toBeInTheDocument();
  });

  it('has the services section id', () => {
    const { container } = renderWithLocale(<Services />);
    expect(container.querySelector('#services')).toBeInTheDocument();
  });
});
