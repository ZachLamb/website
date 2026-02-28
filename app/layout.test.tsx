import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

vi.mock('@/lib/fonts', () => ({
  inter: { variable: '--font-inter' },
  cormorantGaramond: { variable: '--font-cormorant' },
}));

vi.mock('@/components/layout/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Nav</nav>,
}));
vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));
vi.mock('@/components/ui/TrailExtension', () => ({ TrailExtension: () => null }));

import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders main content and includes Vercel Analytics', () => {
    render(
      <RootLayout>
        <div>Page content</div>
      </RootLayout>,
    );
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('vercel-analytics')).toBeInTheDocument();
  });
});
