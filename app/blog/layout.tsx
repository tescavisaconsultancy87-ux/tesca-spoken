import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — TESCA Spoken English | Tips, Guides & Insights',
  description:
    'Read expert tips, study guides, and success stories from TESCA Spoken English. Improve your English speaking, IELTS, PTE, and interview skills.',
  alternates: {
    canonical: 'https://tesca.co/blog',
  },
  openGraph: {
    title: 'Blog — TESCA Spoken English',
    description: 'Tips, guides, and insights to improve your English communication skills.',
    url: 'https://tesca.co/blog',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'TESCA Blog' }],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
