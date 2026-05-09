import { render, screen, act } from '@testing-library/react';
import { TaglineCycler } from './TaglineCycler';

// Hoisted mock controller: tests override this before rendering.
const { motionMocks } = vi.hoisted(() => ({
  motionMocks: { useReducedMotion: vi.fn(() => false) },
}));

vi.mock('framer-motion', () => {
  const factories = {
    p: ({ children, ...props }: { children: React.ReactNode }) => <p {...props}>{children}</p>,
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  };
  return {
    useReducedMotion: () => motionMocks.useReducedMotion(),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: factories,
    m: factories,
    LazyMotion: ({ children }: { children: React.ReactNode }) => children,
    domAnimation: {},
  };
});

describe('TaglineCycler', () => {
  beforeEach(() => {
    motionMocks.useReducedMotion.mockReturnValue(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first tagline immediately', () => {
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={3000} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('advances to the next tagline after the interval elapses', () => {
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={3000} />);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('wraps from the last back to the first', () => {
    render(<TaglineCycler taglines={['Alpha', 'Beta']} intervalMs={1000} />);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('Beta')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('renders ALL taglines stacked when reduced motion is preferred', () => {
    motionMocks.useReducedMotion.mockReturnValue(true);
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={1000} />);
    // All three are reachable — reduced-motion users get the full message
    // statically instead of being trapped on whichever variant is on screen.
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
    // And the cycler still doesn't run an interval.
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getAllByText(/Alpha|Beta|Gamma/)).toHaveLength(3);
  });

  it('does not cycle when only a single tagline is provided', () => {
    render(<TaglineCycler taglines={['Only one']} intervalMs={500} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('Only one')).toBeInTheDocument();
  });

  it('marks the cycling region with aria-live and a role description', () => {
    const { container } = render(<TaglineCycler taglines={['Alpha', 'Beta']} intervalMs={1000} />);
    const region = container.firstChild as HTMLElement;
    expect(region).toHaveAttribute('role', 'region');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region).toHaveAttribute('aria-roledescription', 'rotating tagline');
  });

  it('applies the className to the wrapper', () => {
    const { container } = render(
      <TaglineCycler taglines={['A', 'B']} intervalMs={1000} className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
