import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'English Speaking Courses — Spoken English, IELTS & PTE | TESCA',
  description:
    'Explore TESCA\'s expert-led English courses: Spoken English Basic & Advanced, IELTS Preparation, PTE Coaching, and Interview Training. Live classes since 2005.',
  alternates: {
    canonical: 'https://tesca.co/courses',
  },
  openGraph: {
    title: 'English Speaking Courses — Spoken English, IELTS & PTE | TESCA',
    description:
      'Explore TESCA\'s expert-led English courses: Spoken English Basic & Advanced, IELTS Preparation, PTE Coaching, and Interview Training.',
    url: 'https://tesca.co/courses',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TESCA English Speaking Courses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Speaking Courses — Spoken English, IELTS & PTE | TESCA',
    description:
      'Explore TESCA\'s expert-led English courses: Spoken English Basic & Advanced, IELTS Preparation, PTE Coaching, and Interview Training.',
    images: ['/og-image.jpg'],
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
