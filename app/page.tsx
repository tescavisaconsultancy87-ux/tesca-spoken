import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyTesca from '@/components/WhyTesca';
import Courses from '@/components/Courses';
import Journey from '@/components/Journey';
import StudentSuccess from '@/components/StudentSuccess';
import SchoolMarquee from '@/components/SchoolMarquee';
import Testimonials from '@/components/Testimonials';
import Trainers from '@/components/Trainers';
import FreeTest from '@/components/FreeTest';
import Faq from '@/components/Faq';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'TESCA Spoken English — Master English Fluency from Basic to Advanced',
  description:
    'Join thousands of students and professionals who improved their communication skills through TESCA\'s expert-led programs. Live classes, recorded lessons, IELTS & PTE prep. Trusted since 2005.',
  alternates: {
    canonical: 'https://tesca.co/',
  },
  openGraph: {
    title: 'TESCA Spoken English — Master English Fluency from Basic to Advanced',
    description: 'Master English Fluency with TESCA\'s expert-led classes, IELTS & PTE prep. Trusted since 2005.',
    url: 'https://tesca.co/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TESCA Spoken English — Master English Fluency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TESCA Spoken English — Master English Fluency from Basic to Advanced',
    description: 'Master English Fluency with TESCA\'s expert-led classes, IELTS & PTE prep. Trusted since 2005.',
    images: ['/og-image.jpg'],
  },
};

export default async function Home() {
  let showFreeTest = true;
  try {
    const settings = await db.getSystemSettings();
    showFreeTest = !!settings.enableFreeTest;
  } catch (err) {
    console.error('Failed to load settings in Home Page:', err);
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': 'https://tesca.co/#organization',
    'name': 'TESCA Spoken English',
    'url': 'https://tesca.co',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://tesca.co/Tesca_logo.png',
      'caption': 'TESCA Spoken English Logo'
    },
    'description': 'Master English Fluency from Basic to Advanced — Live classes, recorded lessons, IELTS & PTE prep. Trusted since 2005.'
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://tesca.co/#website',
    'url': 'https://tesca.co',
    'name': 'TESCA Spoken English',
    'publisher': {
      '@id': 'https://tesca.co/#organization'
    }
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalBusiness',
    '@id': 'https://tesca.co/#localbusiness',
    'name': 'TESCA Spoken English',
    'image': 'https://tesca.co/about_hero.png',
    'telephone': '+91 98241 52731',
    'url': 'https://tesca.co',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Sarthana Jakatnaka, Mota Varachha, Hirabaug, Yogichowk',
      'addressLocality': 'Surat',
      'addressRegion': 'Gujarat',
      'postalCode': '395006',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '21.2266',
      'longitude': '72.8943'
    },
    'priceRange': '$$'
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [organizationSchema, websiteSchema, localBusinessSchema]
          })
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <WhyTesca />
        <Courses />
        <Journey />
        <StudentSuccess />
        <SchoolMarquee />
        <Testimonials />
        <Trainers />
        {showFreeTest && <FreeTest />}
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
