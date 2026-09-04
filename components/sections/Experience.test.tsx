vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { experiences } from '@/data/experience';
import { Experience } from './Experience';

describe('Experience', () => {
  it('renders "Trail Log" heading', () => {
    renderWithLocale(<Experience />);
    expect(screen.getByText('Trail Log')).toBeInTheDocument();
  });

  it('renders 4 featured company names by default', () => {
    renderWithLocale(<Experience />);
    const featured = ['Circadence', 'Starbucks', 'StellarFi', 'Sana Benefits'];
    for (const company of featured) {
      expect(screen.getAllByText(company).length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.queryByText('Purple')).not.toBeInTheDocument();
    expect(screen.getByText(/View full trail history/)).toBeInTheDocument();
  });

  it('renders the tenure note explaining the short Sana/StellarFi stints', () => {
    renderWithLocale(<Experience />);
    expect(
      screen.getByText(/Sana Benefits and StellarFi were both company-wide layoffs/),
    ).toBeInTheDocument();
  });

  it('has the experience section id', () => {
    const { container } = renderWithLocale(<Experience />);
    expect(container.querySelector('#experience')).toBeInTheDocument();
  });

  it('does not render manual bullet characters in list items', () => {
    renderWithLocale(<Experience />);
    const listItems = document.querySelectorAll('li');
    listItems.forEach((li) => {
      expect(li.textContent).not.toMatch(/^[•·‣▪]\s/);
    });
  });

  it('renders each featured entry exactly once with a numbered marker', () => {
    renderWithLocale(<Experience />);
    const featured = experiences.filter((e) => e.featured);
    for (const [i, entry] of featured.entries()) {
      const cards = screen.getAllByTestId(`experience-card-${entry.id}`);
      expect(cards).toHaveLength(1);
      expect(screen.getByText(String(i + 1))).toBeInTheDocument();
    }
  });

  it('has no right-aligned prose', () => {
    const { container } = renderWithLocale(<Experience />);
    expect(container.querySelector('.text-right')).toBeNull();
  });

  it('draws one continuous trail line spanning all featured entries, not one per entry', () => {
    const { container } = renderWithLocale(<Experience />);
    const featuredCount = experiences.filter((e) => e.featured).length;
    // One line per entry would leave gaps at the flex gap-2 seams between
    // rows; a single line drawn once behind the whole list stays unbroken.
    const lines = container.querySelectorAll('.border-l.border-dashed.left-4');
    expect(lines.length).toBe(1);
    expect(featuredCount).toBeGreaterThan(1); // sanity: the test is meaningful
  });

  it('reveals the remaining bullets and tech badges beyond the mobile-truncated preview', () => {
    renderWithLocale(<Experience />);
    const entry = experiences.find((e) => e.id === 'circadence')!;
    // The mobile-truncated items are still in the DOM (hidden via CSS below
    // the `sm` breakpoint) rather than removed, so desktop sees the full
    // list without a hover-only reveal.
    for (const item of entry.description) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1);
    }
    for (const tech of entry.techStack) {
      expect(screen.getAllByText(tech).length).toBeGreaterThanOrEqual(1);
    }
  });
});
