import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Skills } from './Skills';

describe('Skills', () => {
  it('renders "Skills" heading', () => {
    renderWithLocale(<Skills />);
    expect(screen.getByRole('heading', { level: 2, name: 'Skills' })).toBeInTheDocument();
  });

  it('renders all 4 category names', () => {
    renderWithLocale(<Skills />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Tools & Infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Leadership & Practices')).toBeInTheDocument();
  });

  it('renders each skill with its years of use', () => {
    renderWithLocale(<Skills />);
    expect(screen.getByText('React').closest('li')).toHaveTextContent('React8y');
    expect(screen.getByText('TypeScript').closest('li')).toHaveTextContent('TypeScript4y');
    expect(screen.getByText('Docker').closest('li')).toHaveTextContent('Docker2y');
  });

  it('grades chips by experience: 5+ years primary, a year or less emerging', () => {
    renderWithLocale(<Skills />);
    expect(screen.getByText('React').closest('li')).toHaveAttribute('data-tier', 'primary');
    expect(screen.getByText('TypeScript').closest('li')).toHaveAttribute('data-tier', 'working');
    expect(screen.getByText('Cypress').closest('li')).toHaveAttribute('data-tier', 'emerging');
  });

  it('explains the three chip styles in a key', () => {
    const { container } = renderWithLocale(<Skills />);
    const key = container.querySelector('[data-skill-legend]');
    expect(key).toHaveTextContent('5y+');
    expect(key).toHaveTextContent('2–4y');
    expect(key).toHaveTextContent('≤1y');
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

  it('renders each category name as a level-3 heading', () => {
    renderWithLocale(<Skills />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });
});
