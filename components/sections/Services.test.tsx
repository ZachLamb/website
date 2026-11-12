import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Services } from './Services';

describe('Services', () => {
  it('renders "What I Do" heading', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('What I Do')).toBeInTheDocument();
  });

  it('renders all 4 service titles', () => {
    renderWithLocale(<Services />);
    expect(screen.getByText('Team Leadership')).toBeInTheDocument();
    expect(screen.getByText('Agile Delivery')).toBeInTheDocument();
    expect(screen.getByText('Product & Roadmap')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Features')).toBeInTheDocument();
  });

  it('has the services section id', () => {
    const { container } = renderWithLocale(<Services />);
    expect(container.querySelector('#services')).toBeInTheDocument();
  });

  it('lists the services as one legend plate, two across from md, all left-aligned', () => {
    const { container } = renderWithLocale(<Services />);
    const legend = container.querySelector('.md\\:grid-cols-2');
    expect(legend).not.toBeNull();
    expect(legend!.children).toHaveLength(4);
    expect(container.querySelector('[class*="text-right"]')).toBeNull();
  });

  it('gives every service a level-3 heading', () => {
    renderWithLocale(<Services />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });
});
