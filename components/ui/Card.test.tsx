import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>,
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="mt-8">Content</Card>);
    expect(container.firstElementChild).toHaveClass('mt-8');
  });

  it('has card base styles', () => {
    const { container } = render(<Card>Styled card</Card>);
    const card = container.firstElementChild!;
    expect(card).toHaveClass('rounded-lg', 'border', 'p-6', 'transition-all');
  });

  it('applies map variant (dashed border)', () => {
    const { container } = render(<Card variant="map">Map card</Card>);
    const card = container.firstElementChild!;
    expect(card).toHaveClass('border-dashed', 'border-bark/20');
  });
});
