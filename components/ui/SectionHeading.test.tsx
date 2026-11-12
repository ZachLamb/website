import { render, screen } from '@testing-library/react';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('renders an h2 by default', () => {
    render(<SectionHeading>Experience</SectionHeading>);
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument();
  });

  it('renders an h1 when asked', () => {
    render(<SectionHeading as="h1">Privacy</SectionHeading>);
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy' })).toBeInTheDocument();
  });

  it('gives the heading the id its section is labelled by', () => {
    render(<SectionHeading sectionId="skills">Skills</SectionHeading>);
    expect(screen.getByRole('heading', { name: 'Skills' })).toHaveAttribute('id', 'skills-heading');
  });

  it('links the title to its own section for sharing', () => {
    render(<SectionHeading sectionId="skills">Skills</SectionHeading>);
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills');
  });

  it('does not link the title without a section id', () => {
    render(<SectionHeading>Privacy</SectionHeading>);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('prints the waypoint number as two digits beside the kicker', () => {
    const { container } = render(
      <SectionHeading number={3} kicker="the trail log">
        Experience
      </SectionHeading>,
    );
    expect(container.querySelector('[data-waypoint-number]')).toHaveTextContent('03');
    expect(screen.getByText('the trail log')).toBeInTheDocument();
  });

  it('hides the number and kicker from assistive tech: the heading is the title', () => {
    render(
      <SectionHeading number={3} kicker="the trail log">
        Experience
      </SectionHeading>,
    );
    expect(screen.getByText('the trail log').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('omits the number for a section that is not a waypoint', () => {
    const { container } = render(
      <SectionHeading number={0} kicker="off trail">
        Elsewhere
      </SectionHeading>,
    );
    expect(container.querySelector('[data-waypoint-number]')).toBeNull();
  });

  it('renders no kicker line when given neither number nor kicker', () => {
    const { container } = render(<SectionHeading>Plain</SectionHeading>);
    expect(container.querySelector('p')).toBeNull();
  });

  it('uses the night palette on the night surface', () => {
    render(
      <SectionHeading number={5} kicker="the pack" onNight>
        Skills
      </SectionHeading>,
    );
    expect(screen.getByRole('heading', { name: 'Skills' })).toHaveClass('text-paper');
    expect(screen.getByText('the pack').parentElement).toHaveClass('text-blaze-bright');
  });
});
