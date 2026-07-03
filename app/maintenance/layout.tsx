import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Under Maintenance — TESCA Spoken English',
  description: 'Our site is currently undergoing scheduled maintenance.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://tesca.co/maintenance',
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
