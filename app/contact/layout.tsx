import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact TESCA Spoken English — Branch Locations & Inquiry Form',
  description:
    'Get in touch with TESCA Spoken English. Contact our Sarthana, Mota Varachha, Hirabaug, or Yogichowk branches in Surat. Phone: +91 98241 52731.',
  alternates: {
    canonical: 'https://tesca.co/contact',
  },
  openGraph: {
    title: 'Contact TESCA Spoken English — Branch Locations & Inquiry Form',
    description: 'Get in touch with TESCA Spoken English. Contact our Sarthana, Mota Varachha, Hirabaug, or Yogichowk branches in Surat.',
    url: 'https://tesca.co/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
