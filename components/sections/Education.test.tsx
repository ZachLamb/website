vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Education } from './Education';

describe('Education', () => {
  it('renders "Ranger Credentials" heading', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('Credentials')).toBeInTheDocument();
  });

  it('renders CU Boulder', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('University of Colorado Boulder')).toBeInTheDocument();
  });

  it('renders Front Range Community College', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('Front Range Community College')).toBeInTheDocument();
  });

  it('renders CSM certification', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('Certified ScrumMaster (CSM)')).toBeInTheDocument();
  });

  it('has the education section id', () => {
    const { container } = renderWithLocale(<Education />);
    expect(container.querySelector('#education')).toBeInTheDocument();
  });

  it('renders certification chips with plate styling', () => {
    const { container } = renderWithLocale(<Education />);
    expect(container.querySelectorAll('.border-bark\\/15').length).toBeGreaterThan(0);
  });
});
