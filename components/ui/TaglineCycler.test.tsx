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

/** The tagline currently shown (the others are stacked beneath, hidden). */
const current = () => document.querySelector('[data-current="true"]');

describe('TaglineCycler', () => {
  beforeEach(() => {
    motionMocks.useReducedMotion.mockReturnValue(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the first tagline immediately', () => {
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={3000} />);
    expect(current()).toHaveTextContent('Alpha');
  });

  it('advances to the next tagline after the interval elapses', () => {
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={3000} />);
    act(() => vi.advanceTimersByTime(3000));
    expect(current()).toHaveTextContent('Beta');
  });

  it('wraps from the last back to the first', () => {
    render(<TaglineCycler taglines={['Alpha', 'Beta']} intervalMs={1000} />);
    act(() => vi.advanceTimersByTime(1000));
    expect(current()).toHaveTextContent('Beta');
    act(() => vi.advanceTimersByTime(1000));
    expect(current()).toHaveTextContent('Alpha');
  });

  it('keeps every tagline in one grid cell, so rotating can never change its height', () => {
    // The regression this guards: the cycler used to swap one <p> for
    // another, so a longer tagline grew the hero and pushed the page down.
    const { container } = render(
      <TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={1000} />,
    );
    const region = container.firstChild as HTMLElement;
    expect(region).toHaveClass('grid');
    const lines = region.querySelectorAll('p');
    expect(lines).toHaveLength(3);
    for (const line of lines) expect(line).toHaveClass('col-start-1', 'row-start-1');
    act(() => vi.advanceTimersByTime(1000));
    expect(region.querySelectorAll('p')).toHaveLength(3);
  });

  it('hides the taglines that are not showing from assistive tech', () => {
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={1000} />);
    expect(screen.getByText('Alpha')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByText('Beta')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Gamma')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders ALL taglines as a plain list when reduced motion is preferred', () => {
    motionMocks.useReducedMotion.mockReturnValue(true);
    render(<TaglineCycler taglines={['Alpha', 'Beta', 'Gamma']} intervalMs={1000} />);
    // All three are readable — reduced-motion users get the full message
    // statically instead of being trapped on whichever variant is on screen.
    for (const text of ['Alpha', 'Beta', 'Gamma']) {
      expect(screen.getByText(text)).not.toHaveAttribute('aria-hidden');
      expect(screen.getByText(text)).not.toHaveClass('opacity-0');
    }
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('does not cycle when only a single tagline is provided', () => {
    render(<TaglineCycler taglines={['Only one']} intervalMs={500} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('Only one')).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('marks the cycling region with aria-live and a role description', () => {
    const { container } = render(<TaglineCycler taglines={['Alpha', 'Beta']} intervalMs={1000} />);
    const region = container.firstChild as HTMLElement;
    expect(region).toHaveAttribute('role', 'region');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region).toHaveAttribute('aria-roledescription', 'rotating tagline');
  });

  it('is keyboard-reachable via tabIndex=0 (WCAG 2.2.2 prerequisite)', () => {
    // Without tabIndex=0, the onFocus/onBlur handlers can never fire for
    // keyboard users — the pause control would be mouse-only.
    const { container } = render(<TaglineCycler taglines={['Alpha', 'Beta']} intervalMs={1000} />);
    expect(container.firstChild).toHaveAttribute('tabIndex', '0');
  });

  it('pauses rotation on focus (keyboard) and resumes on blur', () => {
    const { container } = render(<TaglineCycler taglines={['Alpha', 'Beta']} intervalMs={1000} />);
    const region = container.firstChild as HTMLElement;

    act(() => region.focus());
    act(() => vi.advanceTimersByTime(2000));
    expect(current()).toHaveTextContent('Alpha');

    act(() => region.blur());
    act(() => vi.advanceTimersByTime(1000));
    expect(current()).toHaveTextContent('Beta');
  });

  it('applies the className to the wrapper', () => {
    const { container } = render(
      <TaglineCycler taglines={['A', 'B']} intervalMs={1000} className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
