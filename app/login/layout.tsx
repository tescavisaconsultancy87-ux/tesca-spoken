import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — TESCA Spoken English Student Portal',
  description: 'Login to your TESCA Spoken English account to access courses, live classes, study materials, and track your learning progress.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://tesca.co/login',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
