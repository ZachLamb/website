import { screen, fireEvent } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders "Zach Lamb" site name', () => {
    renderWithLocale(<Navbar />);
    expect(screen.getByText('Zach Lamb')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithLocale(<Navbar />);
    const links = [
      'Trail Guide',
      'Trail Log',
      'Recommendations',
      'Gear',
      'Lodge',
      'Credentials',
      'Contact',
    ];
    for (const label of links) {
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders mobile menu button with aria-expanded', () => {
    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu on button click', () => {
    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders language dropdown with current locale', () => {
    renderWithLocale(<Navbar />);
    const comboboxes = screen.getAllByRole('combobox', { name: /select language/i });
    expect(comboboxes.length).toBeGreaterThanOrEqual(1);
    expect(comboboxes[0]).toHaveValue('en');
  });
});
