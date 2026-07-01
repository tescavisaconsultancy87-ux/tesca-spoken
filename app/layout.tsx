import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import OfferBanner from '@/components/OfferBanner';
import AlertOverlay from '@/components/AlertOverlay';
import { DemoModalProvider } from '@/context/DemoModalContext';
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TESCA Spoken English — Master English Fluency from Basic to Advanced',
  description:
    'Join thousands of students and professionals who improved their communication skills through TESCA\'s expert-led programs. Live classes, recorded lessons, IELTS & PTE prep. Trusted since 2005.',
  keywords: [
    'spoken english',
    'english learning',
    'IELTS preparation',
    'PTE preparation',
    'english classes online',
    'english speaking course',
    'TESCA',
  ],
  openGraph: {
    title: 'TESCA Spoken English — Master English Fluency',
    description:
      'Expert-led English learning: Live classes, recorded lessons, IELTS & PTE prep. Trusted since 2005.',
    type: 'website',
    locale: 'en_US',
    url: 'https://tescaspokenenglish.com',
    siteName: 'TESCA Spoken English',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TESCA Spoken English',
    description: 'Master English Fluency from Basic to Advanced — Anytime, Anywhere.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-body text-ink antialiased overflow-x-hidden">
        <AuthProvider>
          <DemoModalProvider>
            {/* Offer banner sits above everything, including the navbar */}
            <OfferBanner />
            <AlertOverlay />
            {children}
          </DemoModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
