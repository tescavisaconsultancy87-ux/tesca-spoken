import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password — TESCA Spoken English',
  description: 'Reset your TESCA Spoken English account password.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
