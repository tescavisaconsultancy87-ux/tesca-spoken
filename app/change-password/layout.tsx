import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password — TESCA Spoken English',
  description: 'Change your TESCA Spoken English account password securely.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChangePasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
