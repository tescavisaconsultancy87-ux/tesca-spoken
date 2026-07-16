import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free English Assessment — Check Your Fluency Level | TESCA',
  description:
    'Take TESCA\'s free English assessment test to evaluate your speaking, listening, reading, and writing skills. Get instant results and course recommendations.',
  alternates: {
    canonical: 'https://tesca.co/assessment',
  },
  openGraph: {
    title: 'Free English Assessment — Check Your Fluency Level | TESCA',
    description:
      'Take TESCA\'s free English assessment test to evaluate your speaking, listening, reading, and writing skills.',
    url: 'https://tesca.co/assessment',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Free English Assessment — TESCA Spoken English',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free English Assessment — Check Your Fluency Level | TESCA',
    description:
      'Take TESCA\'s free English assessment test to evaluate your speaking, listening, reading, and writing skills.',
    images: ['/og-image.jpg'],
  },
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
