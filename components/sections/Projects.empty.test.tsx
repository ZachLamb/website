// Hide-when-empty behavior. Mocked separately from Projects.test.tsx because
// vi.mock is per-file and we need a different fixture state here.

vi.mock('framer-motion', () => {
  const factories = {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: (props: any) => <path {...props} />,
  };
  return {
    motion: factories,
    m: factories,
    useInView: () => true,
    AnimatePresence: ({ children }: any) => children,
    LazyMotion: ({ children }: any) => children,
    domAnimation: {},
  };
});

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
