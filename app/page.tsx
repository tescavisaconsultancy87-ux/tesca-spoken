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
import StudyAbroadPromo from '@/components/StudyAbroadPromo';
import { db } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  let title = 'TESCA Spoken English — Master English Fluency from Basic to Advanced';
  let description = 'Join thousands of students and professionals who improved their communication skills through TESCA\'s expert-led programs. Live classes, recorded lessons, IELTS & PTE prep. Trusted since 2005.';
  let keywords = [
    'spoken english',
    'english learning',
    'IELTS preparation',
    'PTE preparation',
    'english classes online',
    'english speaking course',
    'TESCA',
  ];

  try {
    const settings = await db.getSystemSettings();
    if (settings.seoTitle) title = settings.seoTitle;
    if (settings.seoDescription) description = settings.seoDescription;
    if (settings.seoKeywords && settings.seoKeywords.length > 0) keywords = settings.seoKeywords;
  } catch (err) {
    console.error('Failed to load dynamic metadata from DB:', err);
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: 'https://tesca.co/',
    },
    openGraph: {
      title,
      description,
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
      title,
      description,
      images: ['/og-image.jpg'],
    },
  };
}

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

  const branchSarthanaSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalBusiness',
    '@id': 'https://tesca.co/#sarthana-branch',
    'name': 'TESCA Spoken English & Visa Consultancy — Sarthana Branch',
    'image': 'https://tesca.co/about_hero.png',
    'telephone': '+91 98241 52731',
    'url': 'https://tesca.co',
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
      'latitude': '21.21728',
      'longitude': '72.88586'
    },
    'priceRange': '$$'
  };

  const branchMotaVarachhaSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalBusiness',
    '@id': 'https://tesca.co/#mota-varachha-branch',
    'name': 'TESCA Spoken English & Visa Consultancy — Mota Varachha Branch',
    'image': 'https://tesca.co/about_hero.png',
    'telephone': '+91 98241 52731',
    'url': 'https://tesca.co',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '106-107, Ambika Pinnacle, Lajamani Chowk, Mota Varachha',
      'addressLocality': 'Surat',
      'addressRegion': 'Gujarat',
      'postalCode': '395006',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '21.238247',
      'longitude': '72.885543'
    },
    'priceRange': '$$'
  };

  const branchHirabaugSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalBusiness',
    '@id': 'https://tesca.co/#hirabaug-branch',
    'name': 'TESCA Spoken English & Visa Consultancy — Hirabaug Branch',
    'image': 'https://tesca.co/about_hero.png',
    'telephone': '+91 98241 52731',
    'url': 'https://tesca.co',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '39, Ambika Vijay Soc., 2nd Floor, Near Surat Super Store, Hirabaug',
      'addressLocality': 'Surat',
      'addressRegion': 'Gujarat',
      'postalCode': '395006',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '21.2148449',
      'longitude': '72.8581873'
    },
    'priceRange': '$$'
  };

  const branchYogichowkSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalBusiness',
    '@id': 'https://tesca.co/#yogichowk-branch',
    'name': 'TESCA Spoken English & Visa Consultancy — Yogichowk Branch',
    'image': 'https://tesca.co/about_hero.png',
    'telephone': '+91 98241 52731',
    'url': 'https://tesca.co',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk',
      'addressLocality': 'Surat',
      'addressRegion': 'Gujarat',
      'postalCode': '395006',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '21.2135179',
      'longitude': '72.8815115'
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
            '@graph': [
              organizationSchema,
              websiteSchema,
              branchSarthanaSchema,
              branchMotaVarachhaSchema,
              branchHirabaugSchema,
              branchYogichowkSchema
            ]
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
        <StudyAbroadPromo />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
