import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { endorsements } from '@/data/endorsements';
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
    expect(
      screen.getByRole('link', { name: /View all recommendations on LinkedIn/i }),
    ).toBeInTheDocument();
  });

  it('has the endorsements section id', () => {
    const { container } = renderWithLocale(<Endorsements />);
    expect(container.querySelector('#endorsements')).toBeInTheDocument();
  });

  it('renders each recommendation once, in a list, with no sideways scroller', () => {
    const { container } = renderWithLocale(<Endorsements />);
    expect(screen.getAllByRole('listitem')).toHaveLength(endorsements.length);
    for (const e of endorsements) expect(screen.getAllByText(e.quote)).toHaveLength(1);
    expect(container.querySelector('[class*="overflow-x-auto"]')).toBeNull();
    expect(container.querySelector('[class*="snap-"]')).toBeNull();
  });

  it('clamps a long quote on phones only, behind a toggle that reports its state', async () => {
    const user = userEvent.setup();
    renderWithLocale(<Endorsements />);
    const quote = screen.getByText(endorsements[0].quote);
    expect(quote).toHaveClass('line-clamp-6', 'md:line-clamp-none');

    const toggle = screen.getAllByRole('button', { name: /read more/i })[0];
    expect(toggle).toHaveClass('md:hidden');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(quote).not.toHaveClass('line-clamp-6');
  });
});
