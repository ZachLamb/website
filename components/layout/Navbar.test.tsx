import { screen, fireEvent, within } from '@testing-library/react';
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
    // Once in the header, once in the mobile menu's own title bar.
    expect(screen.getAllByText('Zach Lamb').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: /Zach Lamb/ })).toHaveAttribute('href', '/en#hero');
  });

  it('renders navigation links', () => {
    renderWithLocale(<Navbar />);
    const links = [
      'About',
      'What I Do',
      'Experience',
      'Recommendations',
      'Skills',
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

  it('mobile menu toggle is wired to the menu via aria-controls', () => {
    // aria-controls + matching id let assistive tech announce "expanded — controls
    // mobile-nav" so AT users know what's about to open before they activate it.
    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn).toHaveAttribute('aria-controls', 'mobile-nav');
    // The controlled element must exist in the DOM.
    expect(document.getElementById('mobile-nav')).toBeInTheDocument();
  });

  it('opens the mobile menu from the menu button and closes it from the close button', () => {
    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i, hidden: true });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the mobile menu on Escape', () => {
    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(btn);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the closed menu inert, so its hidden links cannot be tabbed to', () => {
    renderWithLocale(<Navbar />);
    const menu = document.getElementById('mobile-nav')!;
    expect(menu).toHaveAttribute('inert');
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    expect(menu).not.toHaveAttribute('inert');
  });

  it('lets the open menu scroll, so every link is reachable on a short screen', () => {
    renderWithLocale(<Navbar />);
    expect(document.getElementById('mobile-nav')).toHaveClass(
      'overflow-y-auto',
      'overscroll-contain',
    );
  });

  it('numbers the mobile menu links as waypoints', () => {
    renderWithLocale(<Navbar />);
    const menu = document.getElementById('mobile-nav')!;
    const links = within(menu).getAllByRole('link', { hidden: true });
    expect(links[0]).toHaveTextContent('01About');
    expect(links[links.length - 1]).toHaveTextContent(/^0\dContact$/);
  });

  it('choosing a menu link closes the menu, then scrolls to that section', () => {
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const section = document.createElement('section');
    section.id = 'contact';
    section.tabIndex = -1;
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);

    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(btn);
    const menu = document.getElementById('mobile-nav')!;
    fireEvent.click(within(menu).getByRole('link', { name: /Contact/ }));

    expect(btn).toHaveAttribute('aria-expanded', 'false');
    // The page is unpinned before the scroll is attempted.
    expect(document.body.style.position).toBe('');
    expect(section.scrollIntoView).toHaveBeenCalledOnce();
    expect(window.location.hash).toBe('#contact');
    expect(section).toHaveFocus();

    section.remove();
    window.history.replaceState(null, '', window.location.pathname);
    raf.mockRestore();
    scrollTo.mockRestore();
  });

  it('renders language dropdown with current locale', () => {
    renderWithLocale(<Navbar />);
    const comboboxes = screen.getAllByRole('combobox', { name: /select language/i });
    expect(comboboxes.length).toBeGreaterThanOrEqual(1);
    expect(comboboxes[0]).toHaveValue('en');
  });

  it('pins the page at its scroll position while the menu is open and puts it back, instantly, on close', () => {
    const scrollYSpy = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    renderWithLocale(<Navbar />);
    const btn = screen.getByRole('button', { name: /open menu/i });

    fireEvent.click(btn);
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.top).toBe('-500px');
    expect(document.body.style.width).toBe('100%');

    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.width).toBe('');
    // Instant: a smooth restore animates from the top of the page and was
    // leaving the reader somewhere else.
    expect(scrollTo).toHaveBeenCalledWith({ top: 500, left: 0, behavior: 'instant' });
    // <html> must never be mutated (overflow:hidden there jumps iOS to top).
    expect(document.documentElement.style.overflow).toBe('');

    scrollYSpy.mockRestore();
    scrollTo.mockRestore();
  });

  it('renders the mobile-nav portal only after mount (hydration-safe)', () => {
    // Server snapshot: renderToString has no effects, so a hydration-safe
    // Navbar must NOT include the portal container in server HTML.
    // In jsdom, renderWithLocale runs effects, so after render the portal exists.
    renderWithLocale(<Navbar />);
    expect(document.getElementById('mobile-nav')).toBeInTheDocument();
  });

  it('portals the mobile nav to document.body', () => {
    renderWithLocale(<Navbar />);
    const overlay = document.getElementById('mobile-nav');
    expect(overlay?.parentElement).toBe(document.body);
  });
});
