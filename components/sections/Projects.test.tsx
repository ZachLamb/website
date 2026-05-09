vi.mock('framer-motion', () => {
  const factories = {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    path: (props: any) => <path {...props} />,
    create:
      (tag: string) =>
      ({ children, ...props }: any) => {
        const Tag = tag as any;
        return <Tag {...props}>{children}</Tag>;
      },
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

// Mock the projects data source so these tests stay decoupled from whatever
// state data/projects.ts is in. The site auto-hides the section when nothing
// is published, so the real export is empty by default — but the component's
// happy-path rendering still needs assertions.
vi.mock('@/data/projects', () => {
  const fixtures = [
    {
      id: 'fixture-alpha',
      title: 'Fixture Alpha',
      tagline: 'A test project for component rendering',
      stack: ['React', 'TypeScript'],
      links: { live: 'https://example.com/alpha', repo: 'https://github.com/example/alpha' },
      description: 'A test project description used in component tests.',
      published: true,
    },
    {
      id: 'fixture-beta',
      title: 'Fixture Beta',
      tagline: 'Second test project',
      stack: ['Node.js'],
      links: { repo: 'https://github.com/example/beta' },
      description: 'Another test project description.',
      published: true,
    },
  ];
  return {
    projects: fixtures,
    publishedProjects: fixtures,
    hasPublishedProjects: true,
  };
});

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Projects } from './Projects';
import { publishedProjects } from '@/data/projects';

describe('Projects (with fixtures)', () => {
  it('renders the "Selected Work" heading', () => {
    renderWithLocale(<Projects />);
    expect(screen.getByText('Selected Work')).toBeInTheDocument();
  });

  it('renders every published project by title', () => {
    renderWithLocale(<Projects />);
    for (const project of publishedProjects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it('renders every published project tagline', () => {
    renderWithLocale(<Projects />);
    for (const project of publishedProjects) {
      expect(screen.getByText(project.tagline)).toBeInTheDocument();
    }
  });

  it('renders live links (opening in a new tab) when present', () => {
    renderWithLocale(<Projects />);
    const withLive = publishedProjects.filter((p) => p.links.live);
    const liveLinks = screen.queryAllByRole('link', { name: /live/i });
    expect(liveLinks.length).toBe(withLive.length);
    for (const link of liveLinks) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('renders repo links (opening in a new tab) when present', () => {
    renderWithLocale(<Projects />);
    const withRepo = publishedProjects.filter((p) => p.links.repo);
    const repoLinks = screen.queryAllByRole('link', { name: /repo/i });
    expect(repoLinks.length).toBe(withRepo.length);
    for (const link of repoLinks) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('has the projects section id', () => {
    const { container } = renderWithLocale(<Projects />);
    expect(container.querySelector('#projects')).toBeInTheDocument();
  });
});
