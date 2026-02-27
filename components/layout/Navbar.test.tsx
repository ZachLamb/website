import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders "Zach Lamb" site name', () => {
    render(<Navbar />);
    expect(screen.getByText('Zach Lamb')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    const links = ['Trail Guide', 'Trail Log', 'Gear', 'Lodge', 'Credentials', 'Contact'];
    for (const label of links) {
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders mobile menu button with aria-expanded', () => {
    render(<Navbar />);
    const btn = screen.getByLabelText('Menu');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu on button click', () => {
    render(<Navbar />);
    const btn = screen.getByLabelText('Menu');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
