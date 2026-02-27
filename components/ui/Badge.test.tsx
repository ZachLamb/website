import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>React</Badge>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="mt-4">Tag</Badge>);
    const badge = screen.getByText('Tag');
    expect(badge).toHaveClass('mt-4');
  });

  it('has correct base styling classes', () => {
    render(<Badge>Styled</Badge>);
    const badge = screen.getByText('Styled');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'text-xs');
  });
});
