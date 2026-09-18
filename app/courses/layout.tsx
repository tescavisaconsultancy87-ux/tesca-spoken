import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'English Speaking Courses in Surat — Spoken English, IELTS & PTE | TESCA',
  description:
    'Top-rated Spoken English, IELTS Band 7.5+ & PTE coaching with Cambridge certified trainers in Surat. View course syllabus, flexible timings & affordable fees. Free demo available!',
  alternates: {
    canonical: 'https://tesca.co/courses',
  },
  openGraph: {
    title: 'English Speaking Courses in Surat — Spoken English, IELTS & PTE | TESCA',
    description:
      'Top-rated Spoken English, IELTS Band 7.5+ & PTE coaching with Cambridge certified trainers in Surat. View course syllabus, flexible timings & affordable fees.',
    url: 'https://tesca.co/courses',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TESCA English Speaking Courses Surat',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Speaking Courses in Surat — TESCA',
    description:
      'Top-rated Spoken English, IELTS Band 7.5+ & PTE coaching with Cambridge certified trainers in Surat.',
    images: ['/og-image.jpg'],
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
