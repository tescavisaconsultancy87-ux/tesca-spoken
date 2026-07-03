import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Spoken English Assessment Test — Check Your English Level',
  description:
    'Take TESCA\'s free 5-minute online English grammar and vocabulary assessment test to evaluate your proficiency and find the right spoken English or IELTS batch.',
  alternates: {
    canonical: 'https://tesca.co/assessment',
  },
  openGraph: {
    title: 'Free Spoken English Assessment Test — Check Your English Level',
    description:
      'Take TESCA\'s free 5-minute online English grammar and vocabulary assessment test to evaluate your proficiency and find the right spoken English or IELTS batch.',
    url: 'https://tesca.co/assessment',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Spoken English Assessment Test — Check Your English Level',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Spoken English Assessment Test — Check Your English Level',
    description:
      'Take TESCA\'s free 5-minute online English grammar and vocabulary assessment test to evaluate your proficiency and find the right spoken English or IELTS batch.',
    images: ['/og-image.jpg'],
  },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
