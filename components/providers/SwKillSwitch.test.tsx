import { render, waitFor } from '@testing-library/react';
import { SwKillSwitch } from './SwKillSwitch';

describe('SwKillSwitch', () => {
  it('renders nothing', () => {
    const { container } = render(<SwKillSwitch />);
    expect(container.firstChild).toBeNull();
  });

  it('unregisters every service worker registration on mount', async () => {
    const unregister = vi.fn(async () => true);
    const getRegistrations = vi.fn(async () => [{ unregister }, { unregister }]);

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistrations },
    });

    render(<SwKillSwitch />);

    await waitFor(() => expect(getRegistrations).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(unregister).toHaveBeenCalledTimes(2));
  });

  it('clears all Cache Storage keys on mount', async () => {
    const keysFn = vi.fn(async () => ['v1', 'v2', 'images']);
    const deleteFn = vi.fn(async () => true);

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistrations: vi.fn(async () => []) },
    });
    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: { keys: keysFn, delete: deleteFn },
    });

    render(<SwKillSwitch />);

    await waitFor(() => expect(keysFn).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(deleteFn).toHaveBeenCalledTimes(3));
  });

  it('is a no-op when serviceWorker is unsupported', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: undefined,
    });
    // Just verify it renders without throwing.
    expect(() => render(<SwKillSwitch />)).not.toThrow();
  });
});
