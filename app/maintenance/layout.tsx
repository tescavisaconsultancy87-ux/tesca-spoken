import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance — TESCA Spoken English',
  description: 'TESCA Spoken English is currently under maintenance. We will be back shortly.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
