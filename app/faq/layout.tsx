import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — TESCA Spoken English',
  description:
    'Find answers to common questions about TESCA\'s spoken English courses, IELTS & PTE preparation, fees, batch timings, and teaching methodology.',
  alternates: {
    canonical: 'https://tesca.co/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions — TESCA Spoken English',
    description:
      'Find answers to common questions about TESCA\'s spoken English courses, IELTS & PTE preparation, fees, batch timings, and teaching methodology.',
    url: 'https://tesca.co/faq',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FAQ — TESCA Spoken English',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frequently Asked Questions — TESCA Spoken English',
    description:
      'Find answers to common questions about TESCA\'s spoken English courses, IELTS & PTE preparation, fees, batch timings, and teaching methodology.',
    images: ['/og-image.jpg'],
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
