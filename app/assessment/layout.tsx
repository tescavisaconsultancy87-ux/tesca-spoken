import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Spoken English Assessment Test — Check Your English Level',
  description:
    'Take TESCA\'s free 5-minute online English grammar and vocabulary assessment test to evaluate your proficiency and find the right spoken English or IELTS batch.',
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
