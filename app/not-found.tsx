import { BackToHomeLink } from '@/components/ui/BackToHomeLink';

export default function NotFound() {
  return (
    <div className="bg-parchment flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-forest font-serif text-3xl">You&rsquo;ve wandered off the map</h1>
      <p className="text-bark">
        The page you&rsquo;re looking for doesn&rsquo;t exist in this realm.
      </p>
      <BackToHomeLink />
    </div>
  );
}
