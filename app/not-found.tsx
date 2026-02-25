import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 bg-parchment px-6">
      <h1 className="font-serif text-3xl text-forest">
        You&rsquo;ve wandered off the map
      </h1>
      <p className="text-bark">
        The page you&rsquo;re looking for doesn&rsquo;t exist in this realm.
      </p>
      <Button href="/">Return to the Shire</Button>
    </div>
  );
}
