import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — TESCA Spoken English',
  description:
    'Find answers to common questions about TESCA Spoken English courses, admissions, trainers, course duration, live classes, online batches, and enrollment.',
  alternates: {
    canonical: 'https://tesca.co/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions — TESCA Spoken English',
    description: 'Find answers to common questions about TESCA Spoken English courses.',
    url: 'https://tesca.co/faq',
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
