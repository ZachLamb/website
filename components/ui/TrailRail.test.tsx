import { renderWithLocale } from '@/lib/test-utils';
import { waypoints } from '@/lib/waypoints';
import { TrailRail } from './TrailRail';

const { active } = vi.hoisted(() => ({ active: { id: 'hero' } }));
vi.mock('@/hooks/useActiveSection', () => ({ useActiveSection: () => active.id }));

const states = (container: HTMLElement) =>
  [...container.querySelectorAll('a')].map((a) => a.getAttribute('data-state'));

describe('TrailRail', () => {
  it('has one numbered waypoint per section', () => {
    const { container } = renderWithLocale(<TrailRail />);
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(waypoints.length);
    expect(links[0]).toHaveTextContent('01');
    expect(links[0]).toHaveAttribute('href', '#about');
    expect(links[0]).toHaveAttribute('title', 'About');
  });

  it('is hidden over the hero', () => {
    active.id = 'hero';
    const { container } = renderWithLocale(<TrailRail />);
    expect(container.querySelector('[data-trail-rail]')).toHaveClass('opacity-0');
  });

  it('marks waypoints as passed, here or ahead of the reader', () => {
    active.id = waypoints[2].id;
    const { container } = renderWithLocale(<TrailRail />);
    expect(container.querySelector('[data-trail-rail]')).not.toHaveClass('opacity-0');
    expect(states(container)).toEqual([
      'passed',
      'passed',
      'here',
      ...waypoints.slice(3).map(() => 'ahead'),
    ]);
  });

  it('only appears where the page has a spare gutter', () => {
    const { container } = renderWithLocale(<TrailRail />);
    expect(container.querySelector('[data-trail-rail]')).toHaveClass('hidden', 'xl:block');
  });

  it('is a pointer shortcut only: hidden from assistive tech and the tab order', () => {
    const { container } = renderWithLocale(<TrailRail />);
    expect(container.querySelector('[data-trail-rail]')).toHaveAttribute('aria-hidden', 'true');
    for (const link of container.querySelectorAll('a')) {
      expect(link).toHaveAttribute('tabindex', '-1');
    }
  });
});
