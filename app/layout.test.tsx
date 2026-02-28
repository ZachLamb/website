import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('next/headers', () => ({
  headers: vi.fn(() =>
    Promise.resolve({ get: (key: string) => (key === 'x-next-locale' ? 'en' : null) }),
  ),
}));

vi.mock('@/lib/fonts', () => ({
  inter: { variable: '--font-inter' },
  cormorantGaramond: { variable: '--font-cormorant' },
}));

import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders children and sets html lang from locale header', async () => {
    const layout = await RootLayout({ children: <div>Page content</div> });
    render(layout);
    expect(screen.getByText('Page content')).toBeInTheDocument();
    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');
  });
});
