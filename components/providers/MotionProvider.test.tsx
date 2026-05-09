// Light-touch test for MotionProvider. The interesting behavior — gating
// transforms behind prefers-reduced-motion — is provided by Framer Motion's
// own MotionConfig, which we trust. What we verify here is structural:
// the provider mounts, doesn't crash, and renders its children. If we ever
// regress the wrapper (e.g., remove MotionConfig and break the reduced-motion
// contract for the whole tree), code review + the file-level comment in
// MotionProvider.tsx are the gate. A heavier integration test against
// matchMedia would mostly assert framer-motion's behavior, not ours.

import { render, screen } from '@testing-library/react';
import { MotionProvider } from './MotionProvider';

describe('MotionProvider', () => {
  it('renders children inside the lazy-motion + motion-config wrapper', () => {
    render(
      <MotionProvider>
        <div data-testid="child">Hello</div>
      </MotionProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });
});
