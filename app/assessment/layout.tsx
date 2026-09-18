import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free English Assessment Test — Check Fluency in 2 Mins | TESCA Surat',
  description:
    'Take TESCA’s free 2-minute English fluency test. Evaluate your grammar and vocabulary level, receive instant CEFR score & course recommendation from certified trainers.',
  alternates: {
    canonical: 'https://tesca.co/assessment',
  },
  openGraph: {
    title: 'Free English Assessment Test — Check Fluency in 2 Mins | TESCA Surat',
    description:
      'Take TESCA’s free 2-minute English fluency test. Evaluate your grammar and vocabulary level, receive instant CEFR score & course recommendation from certified trainers.',
    url: 'https://tesca.co/assessment',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Free English Assessment Test Surat — TESCA Spoken English',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free English Assessment Test — Check Fluency in 2 Mins | TESCA Surat',
    description:
      'Take TESCA’s free 2-minute English fluency test. Evaluate your grammar and vocabulary level, receive instant CEFR score & course recommendation.',
    images: ['/og-image.jpg'],
  },
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
