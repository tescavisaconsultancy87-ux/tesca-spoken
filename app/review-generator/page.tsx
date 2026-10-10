import type { Metadata } from 'next';
import ReviewGeneratorClient from './ReviewGeneratorClient';

export const metadata: Metadata = {
  title: 'Leave a 5-Star Google Review | TESCA Spoken English & Visa Consultancy',
  description:
    'Generate an authentic 5-star review in 15 seconds and share your feedback for TESCA Spoken English & Visa Consultancy Surat.',
  // Critical SEO requirement: Keep noindex/nofollow so search engines do not index thin review generator content
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ReviewGeneratorPage() {
  return <ReviewGeneratorClient />;
}
