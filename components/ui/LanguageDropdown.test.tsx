import { fireEvent, screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { LanguageDropdown } from './LanguageDropdown';

const pushMock = vi.fn();
const refreshMock = vi.fn();

// Override the global mock from vitest.setup.ts with a stable push spy so we
// can assert on the exact URL passed to router.push across multiple renders.
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: refreshMock,
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

function setHash(hash: string) {
  Object.defineProperty(window.location, 'hash', {
    value: hash,
    configurable: true,
    writable: true,
  });
}

function clearCookies() {
  for (const entry of document.cookie.split(';')) {
    const name = entry.split('=')[0]?.trim();
    if (!name) continue;
    document.cookie = `${name}=; path=/; max-age=0`;
  }
}

describe('LanguageDropdown', () => {
  beforeEach(() => {
    pushMock.mockClear();
    refreshMock.mockClear();
    setHash('');
    clearCookies();
  });

  it('renders with the current locale selected', () => {
    renderWithLocale(<LanguageDropdown />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    expect(select).toHaveValue('en');
  });

  it('does nothing when the user reselects the current locale', () => {
    renderWithLocale(<LanguageDropdown />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    fireEvent.change(select, { target: { value: 'en' } });
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('navigates to the bare locale root when no hash is set', () => {
    setHash('');
    renderWithLocale(<LanguageDropdown />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    fireEvent.change(select, { target: { value: 'ja' } });
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/ja');
  });

  it('preserves the current hash when switching locales', () => {
    setHash('#services');
    renderWithLocale(<LanguageDropdown />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    fireEvent.change(select, { target: { value: 'ja' } });
    expect(pushMock).toHaveBeenCalledWith('/ja#services');
  });

  it('preserves the hash for other non-default locales (de, experience)', () => {
    setHash('#experience');
    renderWithLocale(<LanguageDropdown />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    fireEvent.change(select, { target: { value: 'de' } });
    expect(pushMock).toHaveBeenCalledWith('/de#experience');
  });

  it('writes the NEXT_LOCALE cookie with the new locale', () => {
    renderWithLocale(<LanguageDropdown />);
    const select = screen.getByRole('combobox', { name: /select language/i });
    fireEvent.change(select, { target: { value: 'ja' } });
    expect(document.cookie).toContain('NEXT_LOCALE=ja');
  });
});
