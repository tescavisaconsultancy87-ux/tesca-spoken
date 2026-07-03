import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — TESCA Spoken English',
  description:
    'Find answers to common questions about TESCA Spoken English courses, admissions, trainers, course duration, live classes, online batches, and enrollment.',
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
