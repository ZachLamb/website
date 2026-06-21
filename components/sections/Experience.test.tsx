vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { experiences } from '@/data/experience';
import { Experience } from './Experience';

function mockMatchMedia(matches: boolean): (query: string) => MediaQueryList {
  return vi.fn(
    (query: string) =>
      Object.assign(
        {
          matches,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        },
        {},
      ) as MediaQueryList,
  );
}

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

  it('has the experience section id', () => {
    const { container } = renderWithLocale(<Experience />);
    expect(container.querySelector('#experience')).toBeInTheDocument();
  });

  it('shows detail panel on desktop when hovering a card', async () => {
    window.matchMedia = mockMatchMedia(true);
    renderWithLocale(<Experience />);
    await waitFor(() => {
      const card = screen.getByTestId('experience-card-circadence');
      expect(card).toBeInTheDocument();
    });
    const card = screen.getByTestId('experience-card-circadence');
    fireEvent.mouseEnter(card);
    await waitFor(() => {
      const panels = document.querySelectorAll('[aria-hidden="true"]');
      const panel = Array.from(panels).find((el) => el.textContent?.includes('Circadence'));
      expect(panel).toBeInTheDocument();
    });
    expect(screen.getAllByText('Circadence').length).toBeGreaterThanOrEqual(1);
    const firstDescription = experiences.find((e) => e.id === 'circadence')!.description[0];
    expect(
      screen.getAllByText((content) => content.includes(firstDescription)).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1);
    window.matchMedia = undefined as any;
  });

  it('initializes isDesktop to false (SSR-safe)', () => {
    // Mock matchMedia to return false (mobile) — isDesktop starts as false
    window.matchMedia = mockMatchMedia(false);
    renderWithLocale(<Experience />);
    // ExperienceDetailPanel only renders when isDesktop && hoveredEntry.
    // Since isDesktop initializes to false, no fixed detail panel appears.
    const detailPanels = document.querySelectorAll('[aria-hidden="true"].fixed');
    expect(detailPanels).toHaveLength(0);
    window.matchMedia = undefined as any;
  });

  it('does not render manual bullet characters in list items', () => {
    window.matchMedia = mockMatchMedia(false);
    renderWithLocale(<Experience />);
    const listItems = document.querySelectorAll('li');
    listItems.forEach((li) => {
      expect(li.textContent).not.toMatch(/^[•·‣▪]\s/);
    });
    window.matchMedia = undefined as any;
  });

  it('detail panel has aria-hidden for accessibility', async () => {
    window.matchMedia = mockMatchMedia(true);
    renderWithLocale(<Experience />);
    await waitFor(() =>
      expect(screen.getByTestId('experience-card-circadence')).toBeInTheDocument(),
    );
    fireEvent.mouseEnter(screen.getByTestId('experience-card-circadence'));
    await waitFor(() => {
      const panels = document.querySelectorAll('[aria-hidden="true"]');
      expect(panels.length).toBeGreaterThanOrEqual(1);
    });
    window.matchMedia = undefined as any;
  });
});
