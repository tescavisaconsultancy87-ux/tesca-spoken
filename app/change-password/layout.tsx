import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Password — TESCA Spoken English',
  description: 'Change your password for security reasons.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://tesca.co/change-password',
  },
};

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
