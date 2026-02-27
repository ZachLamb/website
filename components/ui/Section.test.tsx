import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('renders children', () => {
    render(
      <Section>
        <p>Section content</p>
      </Section>,
    );
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('applies light variant by default (bg-parchment)', () => {
    const { container } = render(<Section>Light</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveClass('bg-parchment');
    expect(section).not.toHaveClass('bg-charcoal');
  });

  it('applies dark variant (bg-charcoal, text-parchment)', () => {
    const { container } = render(<Section variant="dark">Dark</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveClass('bg-charcoal', 'text-parchment');
    expect(section).not.toHaveClass('bg-parchment');
  });

  it('sets id prop on section element', () => {
    const { container } = render(<Section id="about">About</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveAttribute('id', 'about');
  });

  it('applies custom className', () => {
    const { container } = render(<Section className="pt-0">Custom</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveClass('pt-0');
  });
});
