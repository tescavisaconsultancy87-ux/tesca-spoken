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
    description:
      'Find answers to common questions about TESCA Spoken English courses, admissions, trainers, course duration, live classes, online batches, and enrollment.',
    url: 'https://tesca.co/faq',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Frequently Asked Questions — TESCA Spoken English',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions — TESCA Spoken English',
    description:
      'Find answers to common questions about TESCA Spoken English courses, admissions, trainers, course duration, live classes, online batches, and enrollment.',
    images: ['/og-image.jpg'],
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
