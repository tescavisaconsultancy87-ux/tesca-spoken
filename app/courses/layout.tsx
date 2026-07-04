import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'English Courses — TESCA Spoken English | Beginner to Advanced',
  description:
    'Explore TESCA\'s complete range of English courses — Spoken English Basic, Advanced, IELTS preparation, PTE, and Interview Prep. Live classes, flexible schedules, expert trainers.',
  alternates: {
    canonical: 'https://tesca.co/courses',
  },
  openGraph: {
    title: 'English Courses — TESCA Spoken English | Beginner to Advanced',
    description: 'Explore TESCA\'s English courses: Spoken English Basic/Advanced, IELTS, PTE, and Interview Prep.',
    url: 'https://tesca.co/courses',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'English Courses — TESCA Spoken English',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Courses — TESCA Spoken English | Beginner to Advanced',
    description: 'Explore TESCA\'s English courses: Spoken English Basic/Advanced, IELTS, PTE, and Interview Prep.',
    images: ['/og-image.jpg'],
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
