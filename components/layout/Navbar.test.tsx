import { screen, fireEvent } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    // Reset any body styles that a previous test may have left behind.
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
  });

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

  it('locks body with position:fixed preserving scrollY when mobile menu opens, restores on close', () => {
    // Force mobile viewport so the lock code path runs.
    const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('max-width: 767px'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const scrollYSpy = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500);

    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });

    // Open: body is locked with preserved scroll position.
    fireEvent.click(btn);
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-500px');
    expect(document.body.style.width).toBe('100%');

    // Close: body styles are cleared.
    fireEvent.click(btn);
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.width).toBe('');

    // Critically, <html> must never be mutated (was the iOS bug).
    expect(document.documentElement.style.overflow).toBe('');

    matchMediaSpy.mockRestore();
    scrollYSpy.mockRestore();
  });
});
