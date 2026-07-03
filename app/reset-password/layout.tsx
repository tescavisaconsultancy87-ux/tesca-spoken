import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password — TESCA Spoken English',
  description: 'Enter your new password for your TESCA account.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://tesca.co/reset-password',
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
