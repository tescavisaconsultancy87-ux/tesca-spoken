import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import WaveDivider from '@/components/WaveDivider';
import { SURAT_BRANCHES } from '@/lib/data/branches';
import { WHATSAPP_URL } from '@/lib/data/content';
import { MapPin, Phone, Star, Clock, Navigation, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Branches in Surat — Sarthana, Mota Varachha, Hirabaug, Yogichowk | TESCA',
  description:
    'Find your nearest TESCA Spoken English & Visa Consultancy branch in Surat. 4 convenient locations in Sarthana, Mota Varachha, Hirabaug, and Yogichowk. Book a 100% Free Demo Class.',
  alternates: {
    canonical: 'https://tesca.co/branches',
  },
  openGraph: {
    title: 'TESCA Spoken English Branches in Surat | 4 Locations',
    description:
      'Visit our branches in Sarthana, Mota Varachha, Hirabaug, and Yogichowk, Surat. Cambridge-certified English training & study abroad visa consultation.',
    url: 'https://tesca.co/branches',
    siteName: 'TESCA Spoken English',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'TESCA Surat Branches' }],
  },
};

export default function BranchesIndexPage() {
  const branchesListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SURAT_BRANCHES.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      url: `https://tesca.co/branches/${b.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(branchesListSchema) }}
      />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-36 pb-16 lg:pt-44 lg:pb-20">
          <div className="container-x relative z-10 text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              4 Campuses Across Surat, Gujarat
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl font-display">
              Find Your Nearest <span className="text-secondary">TESCA Branch</span> in Surat
            </h1>
            <p className="mt-4 text-base text-neutral-600 sm:text-lg">
              Visit our modern, fully equipped English language learning centers and study abroad visa counseling hubs in Sarthana, Mota Varachha, Hirabaug, and Yogichowk.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Book Free Demo on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-sm font-bold text-neutral-800 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-400"
              >
                Contact Admissions Desk
              </Link>
            </div>
          </div>
        </section>

        <WaveDivider position="bottom" fillColor="text-bg-soft" variant={1} />

        {/* Branches Grid */}
        <section className="py-16 lg:py-24">
          <div className="container-x">
            <div className="grid gap-8 md:grid-cols-2">
              {SURAT_BRANCHES.map((branch) => (
                <div
                  key={branch.slug}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-soft-sm transition-all duration-300 hover:border-primary/40 hover:shadow-soft-xl hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                          {branch.area}
                        </span>
                        <h2 className="mt-2 text-2xl font-bold text-neutral-900 group-hover:text-primary transition-colors">
                          <Link href={`/branches/${branch.slug}`}>{branch.shortName}</Link>
                        </h2>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 border border-amber-200">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-900">{branch.rating}</span>
                        <span className="text-[11px] text-amber-700">({branch.reviewCount})</span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{branch.tagline}</p>

                    <div className="mt-5 space-y-2.5 text-sm text-neutral-700 border-t border-neutral-100 pt-4">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 shrink-0 text-secondary" />
                        <a href={`tel:${branch.phone}`} className="font-medium hover:text-primary transition-colors">
                          {branch.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-neutral-500">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{branch.workingHours}</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Programs Available:</p>
                      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-600">
                        {branch.coursesOffered.slice(0, 4).map((c) => (
                          <li key={c} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3 pt-5 border-t border-neutral-100">
                    <Link
                      href={`/branches/${branch.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-primary-dark"
                    >
                      Branch Details & Maps
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={branch.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-100"
                    >
                      <Navigation className="h-3.5 w-3.5 text-secondary" />
                      Get Directions
                    </a>
                    <a
                      href={`https://wa.me/${branch.whatsapp}?text=Hi%20TESCA%2C%20I%20want%20to%20inquire%20about%20classes%20at%20your%20${encodeURIComponent(branch.shortName)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2.5 text-xs font-semibold hover:bg-emerald-100 transition-all ml-auto"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
