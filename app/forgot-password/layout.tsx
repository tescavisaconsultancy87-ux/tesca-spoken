import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password — TESCA Spoken English',
  description: 'Reset your password for your TESCA account.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://tesca.co/forgot-password',
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
