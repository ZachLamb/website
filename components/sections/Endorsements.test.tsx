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
    expect(screen.getByText('Kimball Heaton')).toBeInTheDocument();
    expect(screen.getByText('Katherine Liu')).toBeInTheDocument();
    expect(screen.getByText('Lia Young')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/View this recommendation on LinkedIn/i).length).toBe(3);
  });

  it('has the endorsements section id', () => {
    const { container } = renderWithLocale(<Endorsements />);
    expect(container.querySelector('#endorsements')).toBeInTheDocument();
  });
});
