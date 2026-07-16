import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — TESCA Spoken English | Surat',
  description:
    'Get in touch with TESCA Spoken English. Visit our branches in Sarthana, Mota Varachha, Hirabaug, or Yogichowk, Surat. Call +91 98241 52731 or email us.',
  alternates: {
    canonical: 'https://tesca.co/contact',
  },
  openGraph: {
    title: 'Contact Us — TESCA Spoken English | Surat',
    description:
      'Get in touch with TESCA Spoken English. Visit our branches in Surat. Call +91 98241 52731 or email us.',
    url: 'https://tesca.co/contact',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact TESCA Spoken English',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — TESCA Spoken English | Surat',
    description:
      'Get in touch with TESCA Spoken English. Visit our branches in Surat. Call +91 98241 52731 or email us.',
    images: ['/og-image.jpg'],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
