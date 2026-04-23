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

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Projects } from './Projects';
import { projects } from '@/data/projects';

describe('Projects', () => {
  it('renders the "Selected Work" heading', () => {
    renderWithLocale(<Projects />);
    expect(screen.getByText('Selected Work')).toBeInTheDocument();
  });

  it('renders every project by title', () => {
    renderWithLocale(<Projects />);
    for (const project of projects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it('renders every project tagline', () => {
    renderWithLocale(<Projects />);
    for (const project of projects) {
      expect(screen.getByText(project.tagline)).toBeInTheDocument();
    }
  });

  it('renders live links (opening in a new tab) when present', () => {
    renderWithLocale(<Projects />);
    const withLive = projects.filter((p) => p.links.live);
    const liveLinks = screen.queryAllByRole('link', { name: /live/i });
    expect(liveLinks.length).toBe(withLive.length);
    for (const link of liveLinks) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('renders repo links (opening in a new tab) when present', () => {
    renderWithLocale(<Projects />);
    const withRepo = projects.filter((p) => p.links.repo);
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
