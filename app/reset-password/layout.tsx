import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password — TESCA Spoken English',
  description: 'Set a new password for your TESCA Spoken English account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
