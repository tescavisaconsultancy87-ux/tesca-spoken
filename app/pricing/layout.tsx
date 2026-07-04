import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TESCA Course Pricing — Affordable Spoken English, IELTS & PTE Batches',
  description:
    'Check out simple, honest pricing for TESCA Spoken English courses. Starter, Professional, and Premium plans with flexible EMI options.',
  alternates: {
    canonical: 'https://tesca.co/pricing',
  },
  openGraph: {
    title: 'TESCA Course Pricing — Affordable Spoken English, IELTS & PTE Batches',
    description:
      'Check out simple, honest pricing for TESCA Spoken English courses. Starter, Professional, and Premium plans with flexible EMI options.',
    url: 'https://tesca.co/pricing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TESCA Course Pricing — Affordable Spoken English, IELTS & PTE Batches',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TESCA Course Pricing — Affordable Spoken English, IELTS & PTE Batches',
    description:
      'Check out simple, honest pricing for TESCA Spoken English courses. Starter, Professional, and Premium plans with flexible EMI options.',
    images: ['/og-image.jpg'],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
