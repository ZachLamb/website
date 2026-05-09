// framer-motion is mocked globally in vitest.setup.ts. The default mock
// renders any m.X tag as the corresponding HTML/SVG element, returns
// useInView=true, useReducedMotion=false. No per-file mock needed here.

import { render, screen } from '@testing-library/react';
import { AnimatedHeading } from './AnimatedHeading';

describe('AnimatedHeading', () => {
  it('renders heading text', () => {
    render(<AnimatedHeading>Hello World</AnimatedHeading>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders as h2 by default', () => {
    render(<AnimatedHeading>Default Heading</AnimatedHeading>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Default Heading');
  });

  it('renders subtitle when provided', () => {
    render(<AnimatedHeading subtitle="Subtitle text">Main</AnimatedHeading>);
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('hides decorative subtitle from assistive tech (aria-hidden)', () => {
    // Roman-numeral subtitles ("I.", "IIb.") are visual-only section markers.
    // They render as confusing strings to screen readers, and the real heading
    // sits in the <h*> below them.
    render(<AnimatedHeading subtitle="IIb.">Recommendations</AnimatedHeading>);
    const subtitle = screen.getByText('IIb.');
    expect(subtitle).toHaveAttribute('aria-hidden', 'true');
    // The real heading must NOT be aria-hidden.
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).not.toHaveAttribute('aria-hidden');
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedHeading className="text-center">Centered</AnimatedHeading>,
    );
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass('text-center');
  });

  it('renders heading as link when sectionId is provided', () => {
    render(<AnimatedHeading sectionId="about">Trail Guide</AnimatedHeading>);
    const link = screen.getByRole('link', { name: 'Trail Guide' });
    expect(link).toHaveAttribute('href', '#about');
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'about-heading');
  });
});
