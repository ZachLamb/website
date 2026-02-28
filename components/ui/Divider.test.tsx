import { render } from '@testing-library/react';
import { Divider } from './Divider';

vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
    span: (props: React.HTMLAttributes<HTMLSpanElement>) => <span {...props} />,
    svg: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
    path: (props: React.SVGProps<SVGPathElement>) => <path {...props} />,
  },
  useInView: () => true,
}));

describe('Divider', () => {
  it('renders the trail variant by default', () => {
    const { container } = render(<Divider />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders mountains variant', () => {
    const { container } = render(<Divider variant="mountains" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders treeline variant', () => {
    const { container } = render(<Divider variant="treeline" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Divider className="my-8" />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveClass('my-8');
  });

  it('supports flip prop', () => {
    const { container } = render(<Divider variant="mountains" flip />);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});
