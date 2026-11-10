vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
}));

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Endorsements } from './Endorsements';

describe('Endorsements', () => {
  it('renders "Trail Recommendations" heading', () => {
    renderWithLocale(<Endorsements />);
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
  });

  it('renders link to LinkedIn recommendations', () => {
    renderWithLocale(<Endorsements />);
    const link = screen.getByText(/View all recommendations on LinkedIn/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders endorsement cards from data', () => {
    renderWithLocale(<Endorsements />);
    // Each card renders twice (desktop grid + mobile carousel, one hidden by
    // CSS at any width), so use getAllByText
    expect(screen.getAllByText('Kimball Heaton').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Katherine Liu').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Lia Young').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole('link', { name: /View all recommendations on LinkedIn/i }),
    ).toBeInTheDocument();
  });

  it('has the endorsements section id', () => {
    const { container } = renderWithLocale(<Endorsements />);
    expect(container.querySelector('#endorsements')).toBeInTheDocument();
  });

  it('renders endorsement cards as map plates', () => {
    const { container } = renderWithLocale(<Endorsements />);
    expect(container.querySelectorAll('.bg-white\\/40').length).toBeGreaterThan(0);
  });
});
