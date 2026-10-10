import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import WaveDivider from '@/components/WaveDivider';
import { getBranchBySlug, SURAT_BRANCHES } from '@/lib/data/branches';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Star,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  Building,
  GraduationCap,
  Award,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export async function generateStaticParams() {
  return SURAT_BRANCHES.map((branch) => ({
    slug: branch.slug,
  }));
}

export default async function BranchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const branch = getBranchBySlug(slug);

  if (!branch) {
    notFound();
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `https://tesca.co/branches/${branch.slug}#branch`,
    name: branch.name,
    description: branch.tagline,
    url: `https://tesca.co/branches/${branch.slug}`,
    telephone: branch.phone,
    email: branch.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
    areaServed: [branch.area, 'Surat', 'Gujarat'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.address,
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      postalCode: branch.postalCode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: branch.latitude.toString(),
      longitude: branch.longitude.toString(),
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '20:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: branch.rating.toString(),
      reviewCount: branch.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: branch.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tesca.co' },
      { '@type': 'ListItem', position: 2, name: 'Branches', item: 'https://tesca.co/branches' },
      { '@type': 'ListItem', position: 3, name: branch.shortName, item: `https://tesca.co/branches/${branch.slug}` },
    ],
  };

  const whatsappMessage = encodeURIComponent(
    `Hi TESCA team! I want to book a Free Demo Class at your ${branch.shortName} (${branch.area}, Surat). Please share available batch timings.`
  );

  return (
    <div className="min-h-screen bg-bg-soft">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-36 pb-16 lg:pt-44 lg:pb-24">
          <div className="container-x relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                <MapPin className="h-3.5 w-3.5" />
                <span>{branch.area}, Surat Campus</span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl font-display">
                {branch.shortName} <span className="text-secondary">— Surat</span>
              </h1>
              <p className="mt-4 text-base text-neutral-600 sm:text-xl font-medium">{branch.tagline}</p>

              {/* Trust Rating Bar */}
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur px-5 py-3 shadow-soft-sm">
                <div className="flex items-center gap-1.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-sm font-bold text-neutral-900">{branch.rating} / 5.0</span>
                </div>
                <span className="hidden sm:inline text-neutral-300">|</span>
                <span className="text-xs sm:text-sm text-neutral-600 font-medium">
                  {branch.reviewCount}+ Google Reviews
                </span>
                <span className="hidden sm:inline text-neutral-300">|</span>
                <a
                  href={branch.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Write Google Review
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${branch.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  Book Free Demo via WhatsApp
                </a>
                <a
                  href={`tel:${branch.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary bg-primary/5 px-6 py-3.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  Call: {branch.phone}
                </a>
                <a
                  href={branch.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3.5 text-sm font-bold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50"
                >
                  <Navigation className="h-4 w-4 text-secondary" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider position="bottom" fillColor="text-bg-soft" variant={1} />

        {/* Location & Contact Grid */}
        <section className="py-16 lg:py-20">
          <div className="container-x">
            <div className="grid gap-12 lg:grid-cols-12 items-start">
              {/* Left Column: Branch Information */}
              <div className="lg:col-span-7 space-y-8">
                <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-soft-sm">
                  <h2 className="text-2xl font-bold text-neutral-900 font-display">Campus Details & Facilities</h2>
                  <p className="mt-2 text-sm text-neutral-600">
                    Visit our {branch.area} campus for in-person counseling, speaking batches, and mock exams.
                  </p>

                  <div className="mt-6 space-y-4 text-sm text-neutral-700">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary mt-0.5 shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Address:</p>
                        <p className="text-neutral-600 mt-0.5">{branch.fullAddress}</p>
                        <p className="text-xs text-neutral-500 mt-1">Landmark: {branch.landmark}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-secondary/10 p-2 text-secondary mt-0.5 shrink-0">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Contact Number:</p>
                        <p className="text-neutral-600 mt-0.5">
                          <a href={`tel:${branch.phone}`} className="hover:text-primary font-medium">
                            {branch.phone}
                          </a>
                          {branch.altPhone && (
                            <>
                              {' '}
                              / <a href={`tel:${branch.altPhone}`} className="hover:text-primary font-medium">{branch.altPhone}</a>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 mt-0.5 shrink-0">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">Working Hours:</p>
                        <p className="text-neutral-600 mt-0.5">{branch.workingHours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mt-8 border-t border-neutral-100 pt-6">
                    <h3 className="text-base font-bold text-neutral-900">Why Students Choose {branch.shortName}:</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {branch.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Landmarks */}
                  <div className="mt-6 rounded-2xl bg-neutral-50 p-4 border border-neutral-200/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Nearby Landmarks:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {branch.nearbyLandmarks.map((lm) => (
                        <span key={lm} className="inline-block rounded-md bg-white border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700 font-medium">
                          {lm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Courses Offered at this Branch */}
                <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-soft-sm">
                  <h2 className="text-2xl font-bold text-neutral-900 font-display">Courses Available at {branch.shortName}</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {branch.coursesOffered.map((course) => (
                      <div key={course} className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-soft-sm">
                        <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{course}</p>
                          <Link href="/courses" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline">
                            View Syllabus <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div className="rounded-3xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-soft-sm">
                  <h2 className="text-2xl font-bold text-neutral-900 font-display">Frequently Asked Questions</h2>
                  <div className="mt-6 divide-y divide-neutral-100">
                    {branch.faqs.map((faq) => (
                      <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 flex items-start gap-2">
                          <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{faq.question}</span>
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-neutral-600 pl-6 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Google Maps & Direct Contact Card */}
              <div className="lg:col-span-5 space-y-8 sticky top-28">
                {/* Google Maps Embed Card */}
                <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-soft-sm">
                  <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">Interactive Google Map</h3>
                      <p className="text-xs text-neutral-500">{branch.landmark}</p>
                    </div>
                    <a
                      href={branch.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Open Maps
                    </a>
                  </div>
                  <div className="relative aspect-[4/3] w-full bg-neutral-100">
                    <iframe
                      src={branch.googleMapsEmbed}
                      className="absolute inset-0 h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Google Maps location for ${branch.name}`}
                    />
                  </div>
                  <div className="p-5 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <div className="text-xs text-neutral-600">
                      <span>Coordinates: </span>
                      <span className="font-mono text-neutral-800 font-semibold">{branch.latitude.toFixed(4)}, {branch.longitude.toFixed(4)}</span>
                    </div>
                    <a
                      href={branch.googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-amber-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      Rate this branch
                    </a>
                  </div>
                </div>

                {/* Quick Admission Lead Card */}
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-7 shadow-soft-md">
                  <span className="inline-block rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary">
                    Limited Seats Per Batch
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-neutral-900 font-display">
                    Book a Free Demo Class at {branch.shortName}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600">
                    Experience our interactive speaking practice, meet Cambridge certified mentors, and get your level evaluated at zero cost.
                  </p>

                  <div className="mt-6 space-y-3">
                    <a
                      href={`https://wa.me/${branch.whatsapp}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Instant Demo Booking
                    </a>
                    <Link
                      href={`/contact?branch=${encodeURIComponent(branch.shortName)}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white py-3.5 text-sm font-bold text-neutral-800 transition-all hover:bg-neutral-50"
                    >
                      Fill Online Inquiry Form
                    </Link>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>No credit card required. 100% Free 45-minute session.</span>
                  </div>
                </div>

                {/* Other Surat Branches Switcher */}
                <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-soft-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Other Surat Campuses:</h4>
                  <div className="mt-3 space-y-2">
                    {SURAT_BRANCHES.filter((b) => b.slug !== branch.slug).map((other) => (
                      <Link
                        key={other.slug}
                        href={`/branches/${other.slug}`}
                        className="flex items-center justify-between rounded-xl p-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{other.shortName}</span>
                        </span>
                        <ArrowRight className="h-3 w-3 text-neutral-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
