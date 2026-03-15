import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ApplicationModal from './ApplicationModal';

describe('ApplicationModal', () => {
  it('renders with dialog semantics and supports escape close', () => {
    const onClose = vi.fn();
    render(<ApplicationModal onClose={onClose} />);

    const dialog = screen.getByRole('dialog', { name: /friend request application/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('returns focus to prior active element on unmount', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open';
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = render(<ApplicationModal onClose={vi.fn()} />);
    unmount();

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('shows fallback error when API returns non-json error body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error('bad json')),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<ApplicationModal onClose={vi.fn()} />);
    const form = document.querySelector('form');
    expect(form).toBeTruthy();

    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    });

    vi.unstubAllGlobals();
  });
});
