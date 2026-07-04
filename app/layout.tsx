import type { Metadata, Viewport } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import OfferBanner from '@/components/OfferBanner';
import AlertOverlay from '@/components/AlertOverlay';
import { DemoModalProvider } from '@/context/DemoModalContext';
import { AuthProvider } from '@/context/AuthContext';
import ScrollToTop from '@/components/ScrollToTop';

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

export const viewport: Viewport = {
  themeColor: '#062426',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tesca.co'),
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
  authors: [{ name: 'TESCA Spoken English', url: 'https://tesca.co' }],
  publisher: 'TESCA Spoken English',
  alternates: {
    canonical: 'https://tesca.co/',
  },
  openGraph: {
    title: 'TESCA Spoken English — Master English Fluency',
    description:
      'Expert-led English learning: Live classes, recorded lessons, IELTS & PTE prep. Trusted since 2005.',
    type: 'website',
    locale: 'en_US',
    url: 'https://tesca.co/',
    siteName: 'TESCA Spoken English',
    images: [
      {
        url: '/og-image.jpg', // Fallback OG Image
        width: 1200,
        height: 630,
        alt: 'TESCA Spoken English',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TESCA Spoken English',
    description: 'Master English Fluency from Basic to Advanced — Anytime, Anywhere.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-body text-ink antialiased overflow-x-hidden">
        <ScrollToTop />
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
