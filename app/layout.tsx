import type { Metadata, Viewport } from 'next';
import { Poppins, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import OfferBanner from '@/components/OfferBanner';
import AlertOverlay from '@/components/AlertOverlay';
import PromoPopup from '@/components/PromoPopup';
import { DemoModalProvider } from '@/context/DemoModalContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import ScrollToTop from '@/components/ScrollToTop';

const GTM_ID = 'GTM-524RC24K';
const GA_ID = 'G-XM5S1GJJXV';
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || '';

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
        '@type': ['EducationalOrganization', 'LocalBusiness'],
        '@id': 'https://tesca.co/#organization',
        'name': 'TESCA Spoken English & Visa Consultancy',
        'url': 'https://tesca.co',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://tesca.co/Tesca_logo.png',
          'width': 140,
          'height': 32,
          'caption': 'TESCA Spoken English Logo'
        },
        'description': 'Leading Spoken English Institute in Surat, Gujarat. Master English Fluency, IELTS & PTE preparation with Cambridge certified trainers since 2005.',
        'telephone': '+91 84888 05888',
        'email': 'tescavisaconsultancy87@gmail.com',
        'priceRange': '₹₹',
        'areaServed': ['Surat', 'Gujarat', 'India'],
        'foundingDate': '2005',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '110,111,112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka',
          'addressLocality': 'Surat',
          'addressRegion': 'Gujarat',
          'postalCode': '395006',
          'addressCountry': 'IN'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': '21.2312',
          'longitude': '72.8833'
        },
        'sameAs': [
          'https://www.facebook.com/tescaspoken',
          'https://www.instagram.com/tescaspoken'
        ]
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
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* Google tag (gtag.js) */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');`,
          }}
        />
      </head>
      <body className="font-body text-ink antialiased overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Microsoft Clarity */}
        {CLARITY_ID && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");`}
          </Script>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalSchema)
          }}
        />
        <ScrollToTop />
        <ToastProvider>
          <AuthProvider>
            <DemoModalProvider>
              {/* Offer banner sits above everything, including the navbar */}
              <OfferBanner />
              <AlertOverlay />
              <PromoPopup />
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
        </ToastProvider>
      </body>
    </html>
  );
}
