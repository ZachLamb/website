import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithLocale } from '@/lib/test-utils';
import { Education } from './Education';

describe('Education', () => {
  it('renders "Ranger Credentials" heading', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('Credentials')).toBeInTheDocument();
  });

  it('renders CU Boulder', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('University of Colorado Boulder')).toBeInTheDocument();
  });

  it('renders Front Range Community College', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('Front Range Community College')).toBeInTheDocument();
  });

  it('renders CSM certification', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('Certified ScrumMaster (CSM)')).toBeInTheDocument();
  });

  it('has the education section id', () => {
    const { container } = renderWithLocale(<Education />);
    expect(container.querySelector('#education')).toBeInTheDocument();
  });

  it('makes only rows with details expandable, and reports their state', async () => {
    const user = userEvent.setup();
    renderWithLocale(<Education />);
    const buttons = screen.getAllByRole('button', { expanded: false });
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent('University of Colorado Boulder');
    // Front Range has no details: plain row, not a disabled button.
    expect(screen.getByText('Front Range Community College').closest('button')).toBeNull();
    await user.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows the details of an expandable row only once it is opened', async () => {
    const user = userEvent.setup();
    renderWithLocale(<Education />);
    expect(screen.queryByText(/Minor in Technology, Arts, and Media/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByText(/Minor in Technology, Arts, and Media/)).toBeInTheDocument();
  });

  it('lists each certification with its issuer', () => {
    renderWithLocale(<Education />);
    expect(screen.getByText('Scrum Alliance')).toBeInTheDocument();
    expect(screen.getByText('Mountain Goat Software (Mike Cohn)')).toBeInTheDocument();
  });
});
