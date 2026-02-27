'use client';

import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-parchment flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-forest font-serif text-3xl">Something went wrong</h1>
      <p className="text-bark">An unexpected error occurred.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
