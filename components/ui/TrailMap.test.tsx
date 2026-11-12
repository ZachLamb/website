import { render, screen, within } from '@testing-library/react';
import { TrailMap } from './TrailMap';

const stops = [
  { id: 'about', href: '#about', label: 'About' },
  { id: 'experience', href: '#experience', label: 'Experience' },
  { id: 'contact', href: '#contact', label: 'Contact' },
];

const renderMap = () =>
  render(<TrailMap stops={stops} title="Trail map" legendLabel="Sections on this page" />);

describe('TrailMap', () => {
  it('shows its title', () => {
    renderMap();
    expect(screen.getByText('Trail map')).toBeInTheDocument();
  });

  it('lists every stop in the legend as a named, numbered link', () => {
    renderMap();
    const legend = screen.getByRole('list', { name: 'Sections on this page' });
    const links = within(legend).getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['#about', '#experience', '#contact']);
    expect(links.map((l) => l.textContent)).toEqual(['01About', '02Experience', '03Contact']);
  });

  it('puts one marker on the map per stop, numbered to match the legend', () => {
    const { container } = renderMap();
    const markers = container.querySelectorAll('[data-map-marker]');
    expect(markers).toHaveLength(3);
    expect([...markers].map((m) => m.textContent)).toEqual(['01', '02', '03']);
    expect(markers[1]).toHaveAttribute('href', '#experience');
  });

  it('keeps the map markers out of the tab order: the legend holds the real links', () => {
    const { container } = renderMap();
    for (const marker of container.querySelectorAll('[data-map-marker]')) {
      expect(marker).toHaveAttribute('tabindex', '-1');
      expect(marker.closest('[aria-hidden="true"]')).not.toBeNull();
    }
    // Only the legend's links are exposed.
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('starts the first marker at the trailhead and ends the last on the summit', () => {
    const { container } = renderMap();
    const markers = container.querySelectorAll<HTMLElement>('[data-map-marker]');
    const first = markers[0].style;
    const last = markers[2].style;
    // Trailhead is bottom-left, summit top-right.
    expect(parseFloat(first.left)).toBeLessThan(parseFloat(last.left));
    expect(parseFloat(first.top)).toBeGreaterThan(parseFloat(last.top));
  });

  it('draws the route with a stroke that does not scale with the map', () => {
    const { container } = renderMap();
    const strokes = container.querySelectorAll('g path');
    expect(strokes.length).toBeGreaterThan(0);
    for (const path of strokes) {
      expect(path).toHaveAttribute('vector-effect', 'non-scaling-stroke');
    }
  });

  it('lets long legend labels wrap instead of cutting them off', () => {
    renderMap();
    const label = screen.getByText('Experience');
    expect(label).not.toHaveClass('truncate');
    expect(label).toHaveClass('break-words');
  });
});
