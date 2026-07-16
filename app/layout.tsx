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
  const globalSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://tesca.co/#organization',
        'name': 'TESCA Spoken English',
        'url': 'https://tesca.co',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://tesca.co/Tesca_logo.png',
          'width': 140,
          'height': 32,
          'caption': 'TESCA Spoken English Logo'
        },
        'description': 'Master English Fluency from Basic to Advanced — Live classes, recorded lessons, IELTS & PTE prep. Trusted since 2005.',
        'telephone': '+91 98241 52731',
        'email': 'tescavisaconsultancy87@gmail.com',
        'areaServed': 'Surat, Gujarat, India',
        'foundingDate': '2005',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '110,111,112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka',
          'addressLocality': 'Surat',
          'addressRegion': 'Gujarat',
          'postalCode': '395006',
          'addressCountry': 'IN'
        }
      },
      {
        '@type': 'WebSite',
        '@id': 'https://tesca.co/#website',
        'url': 'https://tesca.co',
        'name': 'TESCA Spoken English',
        'publisher': {
          '@id': 'https://tesca.co/#organization'
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://tesca.co/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-body text-ink antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalSchema)
          }}
        />
        <ScrollToTop />
        <AuthProvider>
          <DemoModalProvider>
            {/* Offer banner sits above everything, including the navbar */}
            <OfferBanner />
            <AlertOverlay />
            {children}
            {/* ─── Bot Honeypot: invisible to users, traps AI crawlers ─── */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intentional: crawlers follow raw <a>, not <Link> */}
            <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
              <a href="/bot-labyrinth/honeypot/admin-panel">Admin</a>
              <a href="/bot-labyrinth/honeypot/wp-admin">Dashboard</a>
              <a href="/bot-labyrinth/honeypot/sitemap-private">Sitemap</a>
              <a href="/bot-labyrinth/honeypot/.env">Config</a>
              <a href="/bot-labyrinth/honeypot/backup.sql">Backup</a>
            </div>
          </DemoModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
