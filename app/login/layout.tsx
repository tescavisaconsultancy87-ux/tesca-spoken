import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — TESCA Spoken English',
  description: 'Log in to your TESCA Spoken English student or tutor account.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://tesca.co/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
