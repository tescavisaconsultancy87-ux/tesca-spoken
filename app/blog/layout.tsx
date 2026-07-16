import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — English Learning Tips, IELTS Advice & Updates | TESCA',
  description:
    'Read expert articles on spoken English tips, IELTS & PTE preparation strategies, interview advice, and success stories from TESCA students.',
  alternates: {
    canonical: 'https://tesca.co/blog',
  },
  openGraph: {
    title: 'Blog — English Learning Tips, IELTS Advice & Updates | TESCA',
    description:
      'Read expert articles on spoken English tips, IELTS & PTE preparation strategies, interview advice, and success stories.',
    url: 'https://tesca.co/blog',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TESCA Blog — English Learning Tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — English Learning Tips, IELTS Advice & Updates | TESCA',
    description:
      'Read expert articles on spoken English tips, IELTS & PTE preparation strategies, interview advice, and success stories.',
    images: ['/og-image.jpg'],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
