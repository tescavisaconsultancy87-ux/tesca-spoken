'use client';

import { useEffect, useRef } from 'react';
import LandingHeader from './LandingHeader';
import LandingHero from './LandingHero';
import ProblemSection from './ProblemSection';
import SolutionSection from './SolutionSection';
import CourseOverviewSection from './CourseOverviewSection';
import CurriculumSection from './CurriculumSection';
import DemoLessonSection from './DemoLessonSection';
import WhyUsSection from './WhyUsSection';
import AudienceSection from './AudienceSection';
import BeforeAfterSection from './BeforeAfterSection';
import HowItWorksSection from './HowItWorksSection';
import AppShowcaseSection from './AppShowcaseSection';
import TestimonialsSection from './TestimonialsSection';
import PricingOfferSection from './PricingOfferSection';
import FaqSection from './FaqSection';
import FinalCtaSection from './FinalCtaSection';
import LandingFooter from './LandingFooter';
import MobileStickyBar from './MobileStickyBar';
import { metaTracking, trackMetaEvent } from '@/lib/metaPixel';
import { LANDING_CONFIG } from '@/lib/data/spokenEnglishLanding';

export default function SpokenEnglishLandingPage() {
  const tracked50 = useRef(false);
  const tracked90 = useRef(false);

  useEffect(() => {
    // 1. Initial Meta Pixel Triggers
    metaTracking.pageView();
    metaTracking.viewContent(LANDING_CONFIG.courseName, LANDING_CONFIG.actualPrice);

    // 2. Scroll Depth Engaged Audience Tracking (50% & 90%)
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const progress = (window.scrollY / scrollHeight) * 100;

      if (progress >= 50 && !tracked50.current) {
        tracked50.current = true;
        trackMetaEvent('ScrollDepth_50', { depth: 50 }, true);
      }
      if (progress >= 90 && !tracked90.current) {
        tracked90.current = true;
        trackMetaEvent('ScrollDepth_90', { depth: 90 }, true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Schema.org Course Structured Data
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Online Spoken English Course',
    description:
      'Build practical English speaking skills for real-life conversations, work, interviews and everyday communication. Delivered on the Class Plus app.',
    provider: {
      '@type': 'EducationalOrganization',
      name: LANDING_CONFIG.brandName,
      url: 'https://tesca.co',
    },
    educationalLevel: 'Beginner to Intermediate',
    offers: {
      '@type': 'Offer',
      price: LANDING_CONFIG.actualPrice.replace(/[^\d]/g, '') || '999',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://tesca.co/spoken-english-course',
    },
  };

  return (
    <div className="min-h-screen bg-white font-body text-slate-900 selection:bg-[#F97823] selection:text-white relative">
      {/* Schema.org Course metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* 1. Sticky Navigation Header */}
      <LandingHeader />

      {/* 2. Hero Section */}
      <LandingHero />

      {/* 3. Problem Section */}
      <ProblemSection />

      {/* 4. Solution Section */}
      <SolutionSection />

      {/* 5. Course Overview / Key Specifications */}
      <CourseOverviewSection />

      {/* 6. What You'll Learn (Curriculum) */}
      <CurriculumSection />

      {/* 7. Interactive Demo Lesson */}
      <DemoLessonSection />

      {/* 8. Why Learn With Us */}
      <WhyUsSection />

      {/* 9. Target Audience Personas */}
      <AudienceSection />

      {/* 10. Before vs After Transformation */}
      <BeforeAfterSection />

      {/* 11. How It Works (3 Steps) */}
      <HowItWorksSection />

      {/* 12. Class Plus Dedicated App Showcase */}
      <AppShowcaseSection />

      {/* 13. Social Proof & Testimonials */}
      <TestimonialsSection />

      {/* 14. Course Pricing & Urgency Offer */}
      <PricingOfferSection />

      {/* 15. FAQ Section */}
      <FaqSection />

      {/* 16. Full-Width Final CTA */}
      <FinalCtaSection />

      {/* 17. Footer */}
      <LandingFooter />

      {/* 18. Mobile-Only Sticky Conversion Bar */}
      <MobileStickyBar />
    </div>
  );
}
