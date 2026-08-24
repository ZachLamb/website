// framer-motion is mocked globally in vitest.setup.ts. NatureElements is a
// per-file concern so we still mock it locally to avoid the floating-leaves /
// fireflies SVG churn during Section unit tests.

vi.mock('./NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
}));

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

  it('section is programmatically focusable for hash-jump anchors (tabIndex=-1)', () => {
    // Hash-link nav (#projects) should be able to move keyboard focus to the
    // section landmark — tabIndex=-1 enables that without making the section
    // a tab stop in the normal Tab order.
    const { container } = render(<Section id="about">About</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveAttribute('tabIndex', '-1');
  });

  it('applies custom className', () => {
    const { container } = render(<Section className="pt-0">Custom</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveClass('pt-0');
  });

  it('applies map-frame border when mapFrame is true', () => {
    const { container } = render(<Section mapFrame>Map section</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveAttribute('data-map-frame', 'true');
    expect(section).toHaveClass('border-t', 'border-b', 'border-bark/10');
  });

  it('renders decoration outside the content column, as a direct child of <section>', () => {
    const { container } = render(
      <Section decoration={<div data-testid="deco">watermark</div>}>
        <p>Content</p>
      </Section>,
    );
    const section = container.querySelector('section')!;
    const decoration = screen.getByTestId('deco');
    // A direct child of <section>, not nested inside the max-w-5xl content
    // wrapper — otherwise it would be clipped to the content column instead
    // of spanning the section's true full width.
    expect(decoration.parentElement).toBe(section);
  });
});
