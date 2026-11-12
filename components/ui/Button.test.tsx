import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders as a button by default', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders as an anchor when href is provided', () => {
    render(<Button href="/about">About</Button>);
    const link = screen.getByRole('link', { name: 'About' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button', { name: 'Primary' });
    expect(button).toHaveClass('bg-blaze', 'text-paper');
  });

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('border', 'text-ink');
  });

  it('switches both variants to their night-surface colours', () => {
    render(
      <>
        <Button onNight>Primary</Button>
        <Button onNight variant="secondary">
          Secondary
        </Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Primary' })).toHaveClass(
      'bg-blaze-bright',
      'text-night',
    );
    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass('text-paper');
  });

  it('is at least 44px tall for touch', () => {
    render(<Button>Tap</Button>);
    expect(screen.getByRole('button', { name: 'Tap' })).toHaveClass('min-h-12');
  });

  it('accepts custom className', () => {
    render(<Button className="w-full">Wide</Button>);
    const button = screen.getByRole('button', { name: 'Wide' });
    expect(button).toHaveClass('w-full');
  });

  it('forwards onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Clickable' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
