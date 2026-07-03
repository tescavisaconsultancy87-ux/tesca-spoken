import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TESCA Course Pricing — Affordable Spoken English, IELTS & PTE Batches',
  description:
    'Check out simple, honest pricing for TESCA Spoken English courses. Starter, Professional, and Premium plans with EMI options and a 7-day money-back guarantee.',
  alternates: {
    canonical: 'https://tesca.co/pricing',
  },
  openGraph: {
    title: 'TESCA Course Pricing — Affordable Spoken English, IELTS & PTE Batches',
    description: 'Check out simple, honest pricing for TESCA Spoken English courses.',
    url: 'https://tesca.co/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
