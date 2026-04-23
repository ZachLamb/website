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

  it('renders only the first tagline when reduced motion is preferred', () => {
    motionMocks.useReducedMotion.mockReturnValue(true);
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={1000} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    // Still Alpha — the cycling effect is skipped entirely.
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  });

  it('does not cycle when only a single tagline is provided', () => {
    render(<TaglineCycler taglines={['Only one']} intervalMs={500} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('Only one')).toBeInTheDocument();
  });

  it('applies the className to the wrapper', () => {
    const { container } = render(
      <TaglineCycler taglines={['A', 'B']} intervalMs={1000} className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
