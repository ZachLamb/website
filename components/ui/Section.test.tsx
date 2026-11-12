import { render, screen } from '@testing-library/react';
import { Section } from './Section';

describe('Section', () => {
  it('renders children', () => {
    render(<Section>Section content</Section>);
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('renders as a <section> element with the given id', () => {
    const { container } = render(<Section id="about">Content</Section>);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'about');
  });

  it('is labelled by its heading when it has an id', () => {
    const { container } = render(<Section id="about">Content</Section>);
    expect(container.querySelector('section')).toHaveAttribute('aria-labelledby', 'about-heading');
  });

  it('is focusable as an anchor target but is not a tab stop', () => {
    const { container } = render(<Section id="about">Content</Section>);
    expect(container.querySelector('section')).toHaveAttribute('tabindex', '-1');
  });

  it('is the paper surface by default', () => {
    const { container } = render(<Section>Content</Section>);
    const section = container.querySelector('section')!;
    expect(section).toHaveAttribute('data-surface', 'paper');
    expect(section.className).toContain('bg-paper');
    expect(section.className).toContain('text-ink');
  });

  it('applies the meadow and night surfaces', () => {
    const { container: meadow } = render(<Section surface="meadow">Content</Section>);
    expect(meadow.querySelector('section')!.className).toContain('bg-meadow');

    const { container: night } = render(<Section surface="night">Content</Section>);
    const section = night.querySelector('section')!;
    expect(section.className).toContain('bg-night');
    expect(section.className).toContain('text-paper');
  });

  it('draws no top edge when it does not follow another section', () => {
    const { container } = render(<Section>Content</Section>);
    expect(container.querySelector('[data-neatline]')).toBeNull();
    expect(container.querySelector('[data-ridge]')).toBeNull();
  });

  it('rules a neatline between two light sections', () => {
    const { container } = render(
      <Section surface="meadow" after="paper">
        Content
      </Section>,
    );
    expect(container.querySelector('[data-neatline]')).toBeInTheDocument();
    expect(container.querySelector('[data-ridge]')).toBeNull();
  });

  it('draws a ridge in the colour of the section above where light meets night', () => {
    const { container: intoNight } = render(
      <Section surface="night" after="meadow">
        Content
      </Section>,
    );
    const down = intoNight.querySelector('[data-ridge]');
    expect(down).toHaveAttribute('data-ridge', 'meadow');
    expect(down).toHaveAttribute('aria-hidden', 'true');
    expect(intoNight.querySelector('[data-neatline]')).toBeNull();

    const { container: outOfNight } = render(
      <Section surface="paper" after="night">
        Content
      </Section>,
    );
    expect(outOfNight.querySelector('[data-ridge]')).toHaveAttribute('data-ridge', 'night');
  });

  it('does not clip its content: nothing inside can be cut off by the section', () => {
    const { container } = render(<Section>Content</Section>);
    expect(container.querySelector('section')!.className).not.toContain('overflow-hidden');
  });

  it('applies custom className', () => {
    const { container } = render(<Section className="custom-section">Content</Section>);
    expect(container.querySelector('section')!.className).toContain('custom-section');
  });
});
