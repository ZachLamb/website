import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: "Snack's Admin",
  description: 'Application review dashboard',
  robots: { index: false, follow: false },
};

export default function SnackAdminLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
