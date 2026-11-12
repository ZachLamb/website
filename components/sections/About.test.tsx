import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { About } from './About';

describe('About', () => {
  it('renders "About" heading', () => {
    renderWithLocale(<About />);
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
  });

  it('renders stats grid with 4 stat cards', () => {
    renderWithLocale(<About />);
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('Years Building')).toBeInTheDocument();
    expect(screen.getByText('CSM')).toBeInTheDocument();
    expect(screen.getByText('409→10')).toBeInTheDocument();
  });

  it('renders bio text mentioning the Lead UI Developer title', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/Lead UI Developer/)).toBeInTheDocument();
  });

  it('has the about section id', () => {
    const { container } = renderWithLocale(<About />);
    expect(container.querySelector('#about')).toBeInTheDocument();
  });

  it('renders pull-quote and personal note', () => {
    renderWithLocale(<About />);
    expect(screen.getByText(/I'm the Lead UI Developer at Circadence/)).toBeInTheDocument();
    expect(screen.getByText(/Oreo debate/)).toBeInTheDocument();
  });

  it('does not use aria-label on non-interactive paragraph elements', () => {
    renderWithLocale(<About />);
    const paragraphs = document.querySelectorAll('p[aria-label]');
    expect(paragraphs).toHaveLength(0);
  });

  it('prints the stats on one ruled board, numerals in blaze', () => {
    renderWithLocale(<About />);
    const values = ['10+', '5', 'CSM', '409→10'].map((v) => screen.getByText(v));
    expect(values[0]).toHaveClass('text-blaze', 'font-serif');
    // All four cells share a single board rather than being separate cards.
    const board = values[0].parentElement!.parentElement!;
    for (const value of values) expect(board).toContainElement(value);
    expect(board).toHaveClass('grid-cols-2');
  });

  it('numbers the section as the first waypoint', () => {
    const { container } = renderWithLocale(<About />);
    expect(container.querySelector('[data-waypoint-number]')).toHaveTextContent('01');
  });
});
