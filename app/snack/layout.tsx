import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Snack's Dating Resume",
  description: 'You found the secret page.',
  robots: { index: false, follow: false },
};

export default function SnackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
