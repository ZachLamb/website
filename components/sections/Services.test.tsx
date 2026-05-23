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
  it('renders "Services at the Lodge" heading', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('Lodge')).toBeInTheDocument();
  });

  it('renders all 4 service titles', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('Frontend Engineering')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Web Tools')).toBeInTheDocument();
    expect(screen.getByText('Agile Coaching')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Design')).toBeInTheDocument();
  });

  it('has the services section id', () => {
    const { container } = renderWithLocale(<Services />);
    expect(container.querySelector('#services')).toBeInTheDocument();
  });
});
