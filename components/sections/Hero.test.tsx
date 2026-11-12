import { screen } from '@testing-library/react';
import { renderWithLocale } from '@/lib/test-utils';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the name as the page h1', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: 'Zach Lamb' })).toBeInTheDocument();
  });

  it('renders "Lead UI Developer" subtitle', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText('Lead UI Developer')).toBeInTheDocument();
  });

  it('renders the fixed one-line pitch above the rotating tagline', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText(/I lead a UI engineering team/)).toBeInTheDocument();
  });

  it('renders "Get in Touch" primary CTA', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute(
      'href',
      '/en#contact',
    );
  });

  it('renders the secondary CTA pointing at the experience section', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('link', { name: /see my experience/i })).toHaveAttribute(
      'href',
      '/en#experience',
    );
  });

  it('renders social links with accessible labels', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByLabelText(/GitHub/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LinkedIn/i)).toBeInTheDocument();
  });

  it('does not hide its copy behind script: the entrance is a CSS animation', () => {
    // The old hero rendered at opacity 0 until framer-motion hydrated, so
    // the name and pitch were invisible on a slow connection.
    renderWithLocale(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveClass('animate-rise');
    expect(h1.style.opacity).toBe('');
  });

  it('draws the poster landscape as decoration, hidden from assistive tech', () => {
    const { container } = renderWithLocale(<Hero />);
    const scene = container.querySelector('svg[viewBox="0 0 1440 600"]');
    expect(scene).toBeInTheDocument();
    expect(scene).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the resume link in the caption band', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('link', { name: /view resume/i })).toHaveAttribute(
      'href',
      '/zach-lamb-resume.pdf',
    );
  });
});
