vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    create:
      (tag: string) =>
      ({ children, ...props }: any) => {
        const Tag = tag as any;
        return <Tag {...props}>{children}</Tag>;
      },
  },
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  AnimatePresence: ({ children }: any) => children,
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Contact } from './Contact';

describe('Contact', () => {
  it('renders "Leave a Note at Camp" heading', () => {
    render(<Contact />);
    expect(screen.getByText('Leave a Note at Camp')).toBeInTheDocument();
  });

  it('renders name field', () => {
    render(<Contact />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('renders email field', () => {
    render(<Contact />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders message field', () => {
    render(<Contact />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<Contact />);
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('has the contact section id', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('#contact')).toBeInTheDocument();
  });

  it('shows success message on successful submission', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    render(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() => expect(screen.getByText('Message sent!')).toBeInTheDocument());
    vi.restoreAllMocks();
  });

  it('shows error message on failed submission', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'fail' }), { status: 500 }),
    );
    render(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() =>
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument(),
    );
    vi.restoreAllMocks();
  });

  it('shows error message on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    render(<Contact />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form')!);
    await waitFor(() =>
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument(),
    );
    vi.restoreAllMocks();
  });
});
