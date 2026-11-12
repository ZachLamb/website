import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('is a ruled paper plate by default', () => {
    render(<Card>Styled</Card>);
    const card = screen.getByText('Styled');
    expect(card.className).toContain('rounded-md');
    expect(card.className).toContain('border-contour/40');
    expect(card.className).toContain('bg-paper-raised');
  });

  it('switches to the night plate on the night surface', () => {
    render(<Card onNight>Night</Card>);
    const card = screen.getByText('Night');
    expect(card.className).toContain('bg-night-raised');
    expect(card.className).not.toContain('bg-paper-raised');
  });

  it('has no hover movement: a plate is printed on the sheet, not a control', () => {
    render(<Card>Flat</Card>);
    expect(screen.getByText('Flat').className).not.toMatch(/hover:/);
  });

  it('renders as the requested element', () => {
    render(<Card as="article">Entry</Card>);
    expect(screen.getByText('Entry').tagName).toBe('ARTICLE');
  });

  it('merges custom className and passes other attributes through', () => {
    render(
      <Card className="p-5" data-testid="plate">
        Custom
      </Card>,
    );
    const card = screen.getByTestId('plate');
    expect(card.className).toContain('p-5');
  });
});
