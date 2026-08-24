vi.mock('@/components/ui/NatureElements', () => ({
  FloatingLeaves: () => null,
  Fireflies: () => null,
  PineTreeSilhouette: () => null,
  BirdSilhouettes: () => null,
  MistLayer: () => null,
}));

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Contact } from './Contact';

describe('Contact', () => {
  it('renders "Leave a Note at Camp" heading', () => {
    renderWithLocale(<Contact />);
    expect(screen.getByText('Leave a Note at Camp')).toBeInTheDocument();
  });

  it('renders name field', () => {
    renderWithLocale(<Contact />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('renders email field', () => {
    renderWithLocale(<Contact />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders message field', () => {
    renderWithLocale(<Contact />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithLocale(<Contact />);
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('has the contact section id', () => {
    const { container } = renderWithLocale(<Contact />);
    expect(container.querySelector('#contact')).toBeInTheDocument();
  });

  it('shows success view on successful submission', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    renderWithLocale(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() => expect(screen.getByText('Note left at base camp')).toBeInTheDocument());
    expect(screen.getByText('Your message is on its way.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('Send another button resets to form', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 }),
    );
    renderWithLocale(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hi' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() => expect(screen.getByText('Send another')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Send another'));
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
    expect(screen.queryByText('Note left at base camp')).not.toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it('shows API error message on failed submission', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 }),
    );
    renderWithLocale(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'bad-email' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() => expect(screen.getByText('Invalid email address')).toBeInTheDocument());
    vi.restoreAllMocks();
  });

  it('shows fallback error message when API returns non-OK without error body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 500 }),
    );
    renderWithLocale(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() =>
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument(),
    );
    vi.restoreAllMocks();
  });

  it('shows fallback error message on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    renderWithLocale(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() =>
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument(),
    );
    vi.restoreAllMocks();
  });

  it('announces sending state via aria-live region while submitting', async () => {
    // Hold fetch in a pending state so we can observe the live-region content
    // during the 'sending' status (between submit and resolution).
    let resolveFetch!: (v: Response) => void;
    const pendingFetch = new Promise<Response>((r) => {
      resolveFetch = r;
    });
    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(pendingFetch);

    renderWithLocale(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText(/Sending|Send Message/i).closest('form')!);

    // The aria-live region inside the form must contain a sr-only sending
    // announcement so screen readers report the submit state change.
    await waitFor(() => {
      const liveRegions = document.querySelectorAll('[aria-live="polite"]');
      const announcedSending = Array.from(liveRegions).some((r) =>
        r.querySelector('p.sr-only')?.textContent?.match(/sending/i),
      );
      expect(announcedSending).toBe(true);
    });

    // Cleanly resolve so the test doesn't leak a pending promise.
    resolveFetch(new Response(JSON.stringify({}), { status: 200 }));
    await waitFor(() => expect(screen.getByText('Note left at base camp')).toBeInTheDocument());
    vi.restoreAllMocks();
  });

  it('shows rate limit message when API returns 429', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Too many attempts. Please try again later.' }), {
        status: 429,
      }),
    );
    renderWithLocale(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() =>
      expect(screen.getByText('Too many attempts. Please try again later.')).toBeInTheDocument(),
    );
    vi.restoreAllMocks();
  });

  it('renders the end-of-trail cairn beside the direct links', () => {
    const { container } = renderWithLocale(<Contact />);
    expect(container.querySelector('[data-cairn]')).not.toBeNull();
  });
});
