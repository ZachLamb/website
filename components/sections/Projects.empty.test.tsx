// Hide-when-empty behavior. Different vi.mock for @/data/projects than
// Projects.test.tsx — that's why the file is separate. framer-motion is
// mocked globally in vitest.setup.ts.

vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
}));

vi.mock('@/data/projects', () => ({
  projects: [],
  publishedProjects: [],
  hasPublishedProjects: false,
}));

import { renderWithLocale } from '@/lib/test-utils';
import { Projects } from './Projects';

describe('Projects (empty)', () => {
  it('renders nothing when no projects are published', () => {
    const { container } = renderWithLocale(<Projects />);
    expect(container.firstChild).toBeNull();
  });
});
