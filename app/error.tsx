'use client';

import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-paper topo-paper flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-ink font-serif text-4xl font-semibold">Something went wrong</h1>
      <p className="text-ink-soft">An unexpected error occurred.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
