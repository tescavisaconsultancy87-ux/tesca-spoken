import type { Metadata } from 'next';
import TutorLayoutClient from './TutorLayoutClient';

export const metadata: Metadata = {
  title: 'Tutor Dashboard — TESCA Spoken English',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return <TutorLayoutClient>{children}</TutorLayoutClient>;
}
