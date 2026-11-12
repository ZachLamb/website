import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLocale } from '@/lib/test-utils';
import { experiences } from '@/data/experience';
import { Experience } from './Experience';

describe('Experience', () => {
  it('renders "Experience" heading', () => {
    renderWithLocale(<Experience />);
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
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
      screen.getByText(/Sana Benefits and StellarFi both ended in company-wide layoffs/),
    ).toBeInTheDocument();
  });

  it('leads each card with the role as its heading', () => {
    renderWithLocale(<Experience />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Lead UI Developer' }),
    ).toBeInTheDocument();
  });

  it('shows every bullet of a role instead of truncating behind a "+N more" label', () => {
    renderWithLocale(<Experience />);
    const card = screen.getByTestId('experience-card-circadence');
    const lists = card.querySelectorAll('ul');
    // First list: the role's bullets. Second: its tech badges.
    expect(lists[0].querySelectorAll('li')).toHaveLength(5);
    expect(screen.queryByText(/^\+\d+ more$/)).not.toBeInTheDocument();
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

  it('renders each featured entry exactly once, each with a marker on the trail line', () => {
    const { container } = renderWithLocale(<Experience />);
    const featured = experiences.filter((e) => e.featured);
    for (const entry of featured) {
      expect(screen.getAllByTestId(`experience-card-${entry.id}`)).toHaveLength(1);
    }
    expect(container.querySelectorAll('[data-trail-marker]')).toHaveLength(featured.length);
  });

  it('leaves entries unnumbered: numbers on this page identify sections', () => {
    const { container } = renderWithLocale(<Experience />);
    // The only number is the section's own waypoint badge.
    expect(container.querySelectorAll('[data-waypoint-number]')).toHaveLength(1);
    const card = screen.getByTestId('experience-card-circadence');
    expect(within(card).queryByText(/^0\d$/)).not.toBeInTheDocument();
  });

  it('has no right-aligned prose', () => {
    const { container } = renderWithLocale(<Experience />);
    expect(container.querySelector('.text-right')).toBeNull();
  });

  it('draws one continuous trail line spanning all featured entries, not one per entry', () => {
    const { container } = renderWithLocale(<Experience />);
    const featuredCount = experiences.filter((e) => e.featured).length;
    // One line per entry would leave gaps at the seams between rows; a
    // single line drawn once behind the whole list stays unbroken.
    const lines = container.querySelectorAll('.border-l.border-dashed.left-4');
    expect(lines.length).toBe(1);
    expect(featuredCount).toBeGreaterThan(1); // sanity: the test is meaningful
  });

  it('keeps the trail line off phones, where its width is needed for text', () => {
    const { container } = renderWithLocale(<Experience />);
    const line = container.querySelector('.border-l.border-dashed.left-4');
    expect(line).toHaveClass('hidden', 'md:block');
  });

  it('shows every bullet and tech badge of a role', () => {
    renderWithLocale(<Experience />);
    const entry = experiences.find((e) => e.id === 'circadence')!;
    for (const item of entry.description) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    const card = screen.getByTestId('experience-card-circadence');
    for (const tech of entry.techStack) {
      expect(within(card).getByText(tech)).toBeInTheDocument();
    }
  });

  it('opens and closes the earlier roles from a button that reports its state', async () => {
    const user = userEvent.setup();
    renderWithLocale(<Experience />);
    const toggle = screen.getByRole('button', { name: /View full trail history/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    // The region it controls exists before it is opened.
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByText('Purple').length).toBeGreaterThanOrEqual(1);

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Purple')).not.toBeInTheDocument();
  });
});
