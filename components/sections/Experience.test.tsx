vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: (props: any) => <path {...props} />,
    circle: (props: any) => <circle {...props} />,
    create:
      (tag: string) =>
      ({ children, ...props }: any) => {
        const Tag = tag as any;
        return <Tag {...props}>{children}</Tag>;
      },
  },
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  AnimatePresence: ({ children }: any) => children,
}));

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

  it('renders all 10 company names', () => {
    renderWithLocale(<Experience />);
    const companies = [
      'Circadence',
      'Starbucks',
      'StellarFi',
      'Sana Benefits',
      'Purple',
      'The Regis Company',
      'Charter Communications',
      'Freelance Designer',
      'Lab for Playful Computation',
      'CU Boulder IT / MCDB',
    ];
    for (const company of companies) {
      expect(screen.getAllByText(company).length).toBeGreaterThanOrEqual(1);
    }
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
