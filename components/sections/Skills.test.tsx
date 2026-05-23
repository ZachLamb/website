vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Skills } from './Skills';

describe('Skills', () => {
  it('renders "Gear" heading', () => {
    renderWithLocale(<Skills />);
    expect(screen.getByText('Gear')).toBeInTheDocument();
  });

  it('renders all 4 category names', () => {
    renderWithLocale(<Skills />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Tools & Infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Practices')).toBeInTheDocument();
  });

  it('renders individual skills', () => {
    renderWithLocale(<Skills />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Agile/Scrum')).toBeInTheDocument();
  });

  it('has the skills section id', () => {
    const { container } = renderWithLocale(<Skills />);
    expect(container.querySelector('#skills')).toBeInTheDocument();
  });

  it('does not use role="article" on skill category cards', () => {
    renderWithLocale(<Skills />);
    const articles = document.querySelectorAll('[role="article"]');
    expect(articles).toHaveLength(0);
  });
});
