import type { Metadata } from 'next';
import SpokenEnglishLandingPage from '@/components/landing/SpokenEnglishLandingPage';

export const metadata: Metadata = {
  title: 'Online Spoken English Course | Speak English With Confidence | TESCA & Class Plus',
  description:
    'Master practical spoken English for everyday conversations, job interviews, and workplace communication. Structured lessons on Class Plus mobile app. Beginner-friendly. Enroll today!',
  alternates: {
    canonical: 'https://tesca.co/spoken-english-course',
  },
  openGraph: {
    title: 'Online Spoken English Course | Speak English With Confidence | TESCA',
    description:
      'Learn practical spoken English through structured lessons, real-life examples and regular practice — all from your phone on Class Plus.',
    url: 'https://tesca.co/spoken-english-course',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TESCA Spoken English Course',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Spoken English Course | TESCA',
    description:
      'Speak English with confidence, without fear or hesitation. Mobile learning on Class Plus.',
    images: ['/og-image.jpg'],
  },
};

export default function SpokenEnglishCoursePage() {
  return <SpokenEnglishLandingPage />;
}
