import { BackToHomeLink } from '@/components/ui/BackToHomeLink';

export default function NotFound() {
  return (
    <div className="bg-paper topo-paper flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-ink font-serif text-4xl font-semibold">
        You&rsquo;ve wandered off the map
      </h1>
      <p className="text-ink-soft">
        The page you&rsquo;re looking for doesn&rsquo;t exist in this realm.
      </p>
      <BackToHomeLink />
    </div>
  );
}
