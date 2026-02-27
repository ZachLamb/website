import { render } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders the divider line', () => {
    const { container } = render(<Divider />);
    const line = container.querySelector('.border-t');
    expect(line).toBeInTheDocument();
  });

  it('shows trail signpost icon by default', () => {
    const { container } = render(<Divider />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('hides icon when showIcon is false', () => {
    const { container } = render(<Divider showIcon={false} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Divider className="my-8" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass('my-8');
  });
});
