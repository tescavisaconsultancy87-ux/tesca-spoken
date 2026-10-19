'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import WaveDivider from '@/components/WaveDivider';
import { useTracking } from '@/hooks/useTracking';
import { WHATSAPP_URL } from '@/lib/data/content';
import toast from '@/lib/toast';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  Clock,
  MessageCircle,
  Star,
  ChevronDown,
  Award,
  BookOpen,
  CalendarCheck,
  Sparkles,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
  DropdownMenuItem,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';

const INQUIRY_COURSES = [
  'Spoken English Basic (Beginner to Intermediate)',
  'Spoken English Advanced (Corporate & Public Speaking)',
  'IELTS Preparation (Academic / General)',
  'PTE Preparation (Score 65+ / 79+)',
  'Interview Preparation & Personality Development',
  'Study Abroad & Student Visa Consultation',
  'General Inquiry & Free Demo Class',
];

const BRANCH_OPTIONS = [
  'Branch 1 — Sarthana Jakatnaka, Surat',
  'Branch 2 — Mota Varachha (Lajamani Chowk), Surat',
  'Branch 3 — Hirabaug (Varachha), Surat',
  'Branch 4 — Yogichowk, Surat',
  'Online Live Interactive Batch (Worldwide)',
];

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: 'Call Us Directly',
    lines: ['+91 84888 05888', '+91 99250 60609'],
    hint: 'Mon – Sat, 7am – 8pm • Instant Response',
    action: 'tel:+918488805888',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Us',
    lines: ['+91 84888 05888'],
    hint: 'Instant support & demo booking',
    action: WHATSAPP_URL,
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['tescavisaconsultancy87@gmail.com'],
    hint: 'We reply within 24 hours',
    action: 'mailto:tescavisaconsultancy87@gmail.com',
  },
];

const BRANCHES = [
  {
    slug: 'sarthana',
    title: 'Branch 1 - Sarthana (Head Office)',
    address: '110,111,112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka, Surat.',
    phone: '+91 84888 05888',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29754.938162078433!2d72.8858624!3d21.21728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f8647b359b3%3A0x11f64af5f5637cfe!2sTESCA%20VISA%20CONSULTANCY!5e0!3m2!1sen!2sin!4v1783070611318!5m2!1sen!2sin',
  },
  {
    slug: 'mota-varachha',
    title: 'Branch 2 - Mota Varachha',
    address: '106-107, Ambika Pinnacle, Lajamani Chowk, Mota Varachha, Surat.',
    phone: '+91 99250 60609',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.8386097921198!2d72.88554337597363!3d21.238247480549106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fffa7abe0fb%3A0xd7c140b507f0e691!2sTESCA%20SPOKEN%20ENGLISH%20AND%20VISA%20COUNSULTANCY!5e0!3m2!1sen!2sin!4v1783070684461!5m2!1sen!2sin',
  },
  {
    slug: 'hirabaug',
    title: 'Branch 3 - Hirabaug',
    address: '39, Ambika Vijay Soc., 2nd Floor, Near Surat Super Store, Hirabaug, Surat.',
    phone: '+91 84888 05888',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1859.7143171918644!2d72.85818739660405!3d21.214844924916058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f003b425e37%3A0xbe2c90ec8201665e!2sTESCA%20ENGLISH%20SPOKEN!5e0!3m2!1sen!2sin!4v1783072796797!5m2!1sen!2sin',
  },
  {
    slug: 'yogichowk',
    title: 'Branch 4 - Yogichowk',
    address: '2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk, Surat.',
    phone: '+91 84888 05888',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.4620727097463!2d72.88151159678955!3d21.21351790000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f00099b1a45%3A0x790d12f6f9c10d20!2sTESCA%20SPOKEN%20ENGLISH%20%26%20COMPUTER%20EDUCATION!5e0!3m2!1sen!2sin!4v1783070752116!5m2!1sen!2sin',
  },
];

function ContactContent() {
  const searchParams = useSearchParams();
  const [mapsLoaded, setMapsLoaded] = useState<Record<string, boolean>>({});
  const [inquiryType, setInquiryType] = useState<'demo' | 'general'>('demo');
  const [contextBadge, setContextBadge] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    course: INQUIRY_COURSES[0],
    branch: BRANCH_OPTIONS[0],
    message: '',
  });

  const { getLeadEnrichment, trackEvent } = useTracking();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ─── Adaptive URL Parameter Parsing (Restores Lost Intent from Ads/Branches/Navbar) ───
  useEffect(() => {
    const branchParam = searchParams.get('branch')?.toLowerCase() || '';
    const courseParam = searchParams.get('course')?.toLowerCase() || '';
    const topicParam = searchParams.get('topic')?.toLowerCase() || '';
    const serviceParam = searchParams.get('service')?.toLowerCase() || '';
    const countryParam = searchParams.get('country')?.toLowerCase() || '';
    const demoParam = searchParams.get('demo')?.toLowerCase() || searchParams.get('type')?.toLowerCase() || '';

    if (demoParam === 'true' || demoParam === 'demo') {
      setInquiryType('demo');
    }

    // Branch matching
    let matchedBranch: string | null = null;
    let badgeText: string | null = null;

    if (branchParam.includes('sarthana')) {
      matchedBranch = BRANCH_OPTIONS[0];
      badgeText = '📍 Sarthana Jakatnaka Campus Selected';
    } else if (branchParam.includes('mota') || branchParam.includes('varachha') || branchParam.includes('lajamani')) {
      matchedBranch = BRANCH_OPTIONS[1];
      badgeText = '📍 Mota Varachha Campus Selected';
    } else if (branchParam.includes('hira') || branchParam.includes('hirabaug')) {
      matchedBranch = BRANCH_OPTIONS[2];
      badgeText = '📍 Hirabaug Campus Selected';
    } else if (branchParam.includes('yogi') || branchParam.includes('yogichowk')) {
      matchedBranch = BRANCH_OPTIONS[3];
      badgeText = '📍 Yogichowk Campus Selected';
    } else if (branchParam.includes('online') || branchParam.includes('world')) {
      matchedBranch = BRANCH_OPTIONS[4];
      badgeText = '🌐 Online Live Interactive Batch Selected';
    }

    // Course & Topic matching
    let matchedCourse: string | null = null;
    const combinedCourseQuery = `${courseParam} ${topicParam} ${serviceParam} ${countryParam}`.trim();

    if (combinedCourseQuery.includes('ielts')) {
      matchedCourse = INQUIRY_COURSES[2];
      badgeText = badgeText ? `${badgeText} • IELTS Preparation` : '🎯 IELTS Preparation (Band 7.5+ Target)';
    } else if (combinedCourseQuery.includes('pte')) {
      matchedCourse = INQUIRY_COURSES[3];
      badgeText = badgeText ? `${badgeText} • PTE Preparation` : '🎯 PTE Academic (Score 65+ / 79+)';
    } else if (
      combinedCourseQuery.includes('study-abroad') ||
      combinedCourseQuery.includes('visa') ||
      combinedCourseQuery.includes('opportunity') ||
      combinedCourseQuery.includes('graduate') ||
      combinedCourseQuery.includes('canada') ||
      combinedCourseQuery.includes('spain') ||
      combinedCourseQuery.includes('germany') ||
      combinedCourseQuery.includes('uk') ||
      combinedCourseQuery.includes('document')
    ) {
      matchedCourse = INQUIRY_COURSES[5];
      const serviceName = serviceParam || countryParam || 'Visa Consultation';
      badgeText = badgeText ? `${badgeText} • ${serviceName}` : `🎓 ${serviceName} Fast-Track Counseling`;
    } else if (combinedCourseQuery.includes('advance')) {
      matchedCourse = INQUIRY_COURSES[1];
      badgeText = badgeText ? `${badgeText} • Advanced English` : '🗣️ Spoken English Advanced Selected';
    } else if (combinedCourseQuery.includes('interview') || combinedCourseQuery.includes('personality')) {
      matchedCourse = INQUIRY_COURSES[4];
      badgeText = badgeText ? `${badgeText} • Interview Training` : '💼 Interview & Personality Training Selected';
    } else if (combinedCourseQuery.includes('basic') || combinedCourseQuery.includes('spoken')) {
      matchedCourse = INQUIRY_COURSES[0];
    }

    if (badgeText) {
      setContextBadge(badgeText);
    }

    if (matchedBranch || matchedCourse) {
      setForm((prev) => ({
        ...prev,
        ...(matchedBranch ? { branch: matchedBranch } : {}),
        ...(matchedCourse ? { course: matchedCourse } : {}),
      }));
    }
  }, [searchParams]);

  // Compute dynamic WhatsApp URL based on live form selections
  const dynamicWhatsAppUrl = `https://wa.me/918488805888?text=${encodeURIComponent(
    `Hello TESCA Team, ${form.name ? `my name is ${form.name.trim()} and ` : ''}I want to inquire about ${form.course} at ${form.branch}.${inquiryType === 'demo' ? ' I would like to book a 100% Free Live Demo Class.' : ''} Please share batch timings and fee structure.`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Normalize phone number (allow +91, 0 prefix, international numbers)
    const digits = form.phone.replace(/\D/g, '');
    let targetPhone = digits;
    if (digits.length === 12 && digits.startsWith('91')) targetPhone = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith('0')) targetPhone = digits.slice(1);

    if (targetPhone.length < 7 || targetPhone.length > 15) {
      const errMsg = 'Please enter a valid phone or WhatsApp number (e.g. +91 98765 43210).';
      setError(errMsg);
      toast.error(errMsg, 'Validation Error');
      setLoading(false);
      return;
    }

    const enrichment = getLeadEnrichment();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          name: form.name.trim(),
          phone: targetPhone,
          email: form.email.trim() || undefined,
          course: form.course,
          branch: form.branch,
          topic: form.course,
          inquiry_type: inquiryType,
          message: form.message.trim() || `${inquiryType === 'demo' ? '100% FREE DEMO CLASS BOOKING' : 'Course Inquiry'} for ${form.course} (${form.branch})`,
          ...enrichment,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry.');
      }

      setSubmitted(true);
      toast.success(
        inquiryType === 'demo'
          ? 'Your Free Demo Class is reserved! Our counselor will call you within 15 minutes.'
          : 'Your inquiry has been submitted! Our counseling team will call you shortly.',
        inquiryType === 'demo' ? 'Demo Reserved 🎉' : 'Inquiry Received'
      );
      trackEvent('generate_lead', {
        value: 1,
        currency: 'INR',
        lead_type: inquiryType === 'demo' ? 'free_demo_booking' : 'contact_inquiry',
        course: form.course,
        branch: form.branch,
      });
      trackEvent('contact_submit', {
        course: form.course,
        branch: form.branch,
      });
      trackEvent('lead_form_submit', { formType: 'contact', course: form.course, branch: form.branch });
    } catch (err: any) {
      console.error('Contact submit error:', err);
      const errMsg = err.message || 'An unexpected error occurred. Please try again.';
      setError(errMsg);
      toast.error(errMsg, 'Submission Error');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tesca.co',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact Us',
        item: 'https://tesca.co/contact',
      },
    ],
  };

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact TESCA Spoken English & Visa Consultancy',
    description: 'Contact details, WhatsApp direct line, and campus locations for TESCA in Surat.',
    url: 'https://tesca.co/contact',
    mainEntity: {
      '@type': 'EducationalBusiness',
      name: 'TESCA Spoken English & Visa Consultancy',
      telephone: '+91 84888 05888',
      areaServed: 'Surat, Gujarat, India',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Royal Arcade, Sarthana Jakatnaka / Ambika Pinnacle, Mota Varachha',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        postalCode: '395006',
        addressCountry: 'IN',
      },
    },
  };

  return (
    <div className="min-h-screen bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-36 pb-0 lg:pt-44 lg:pb-0">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          <div className="container-x relative z-10 pb-8">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-5">
                <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Counselors Active Today
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-3.5 py-1.5 text-xs font-semibold text-amber-900">
                    <Flame className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
                    Next Batch: This Monday
                  </span>
                </div>

                <h1 className="font-heading text-3xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl tracking-tight">
                  Connect With Us &{' '}
                  <span className="gradient-text">Start Speaking</span>
                </h1>

                <p className="max-w-xl text-base sm:text-lg leading-relaxed text-ink-muted mx-auto lg:mx-0">
                  Have questions about our Spoken English, IELTS, PTE, or Study Abroad programs in Surat? Book your 100% free live demo class or chat with our senior counselors immediately.
                </p>

                {/* 1-Tap Quick Action Buttons on Hero */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href={dynamicWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { placement: 'contact_hero' })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 text-sm font-bold shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageCircle className="h-5 w-5 fill-current" />
                    <span>Quick WhatsApp (+91 84888 05888)</span>
                  </a>

                  <a
                    href="tel:+918488805888"
                    onClick={() => trackEvent('phone_click', { placement: 'contact_hero' })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-black/10 hover:border-primary/30 text-ink px-6 py-3.5 text-sm font-bold shadow-soft hover:bg-black/5 transition-all"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    <span>Call Helpline</span>
                  </a>
                </div>

                {/* Quick Trust Highlights */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                  {[
                    { icon: Award, text: '100% Free Demo Class' },
                    { icon: Clock, text: '< 15 Min Call Back' },
                    { icon: ShieldCheck, text: 'No Advance Payment' },
                    { icon: Star, text: '4.9/5 Rating (1,200+ Reviews)' },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-1.5 rounded-full bg-white border border-black/8 px-3.5 py-1.5 text-xs font-medium text-ink-soft shadow-soft"
                    >
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual illustration */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-soft-lg">
                  <Image
                    src="/contact_hero.png"
                    alt="TESCA Student Support Team"
                    fill
                    priority
                    sizes="(max-width: 768px) 340px, 450px"
                    className="object-contain p-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <WaveDivider position="bottom" fillColor="text-[#F8FAFC]" variant={1} className="mt-4" />
        </section>

        {/* ── Main Interactive Inquiry & Conversion Hub ── */}
        <section id="inquiry-form" className="relative bg-bg-soft pt-12 pb-0 lg:pt-16 lg:pb-0">
          <div className="container-x">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-soft-xl grid lg:grid-cols-5">
              
              {/* 
                Form Column: Placed FIRST on mobile (order-1 lg:order-2)
                Eliminates scrolling through 4 campus addresses on mobile before seeing the form!
              */}
              <div className="order-1 lg:order-2 p-6 sm:p-8 lg:p-12 lg:col-span-3 bg-primary text-white relative">
                {/* Decorative background glows */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-secondary/15 blur-2xl" />

                <div className="relative z-10 h-full flex flex-col justify-center">
                  {/* Contextual Intent Badge (when user arrives from specific ad or link) */}
                  {contextBadge && (
                    <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-secondary/20 border border-secondary/40 px-3.5 py-2 text-xs font-bold text-secondary">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>{contextBadge}</span>
                    </div>
                  )}

                  {submitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-8 ring-white/5">
                        <Check className="h-8 w-8 text-secondary" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold">
                        Thank You! Inquiry Received 🎉
                      </h3>
                      <p className="mt-3 text-primary-100 max-w-sm text-sm leading-relaxed">
                        Our senior counselor will review your inquiry and call/WhatsApp you within 15 minutes to share batch schedules and confirm your free live demo class.
                      </p>
                      
                      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                        <a
                          href={dynamicWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 text-xs font-bold shadow-md transition-all"
                        >
                          <MessageCircle className="h-4 w-4 fill-current" />
                          <span>Open in WhatsApp Now</span>
                        </a>
                        <button
                          onClick={() => {
                            setSubmitted(false);
                            setForm({
                              name: '',
                              phone: '',
                              email: '',
                              course: INQUIRY_COURSES[0],
                              branch: BRANCH_OPTIONS[0],
                              message: '',
                            });
                            setError('');
                          }}
                          className="w-full rounded-xl bg-white/10 hover:bg-white/20 px-4 py-3 text-xs font-bold text-white transition-all"
                        >
                          Submit Another
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Mode Toggle (Free Demo vs General Inquiry) */}
                      <div className="flex rounded-xl bg-black/20 p-1 mb-2">
                        <button
                          type="button"
                          onClick={() => setInquiryType('demo')}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                            inquiryType === 'demo'
                              ? 'bg-secondary text-primary shadow-sm'
                              : 'text-primary-100 hover:text-white'
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Book Free Live Demo</span>
                          <span className="ml-1 rounded bg-black/25 px-1.5 py-0.5 text-[9px] font-extrabold text-white">FREE</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setInquiryType('general')}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all cursor-pointer ${
                            inquiryType === 'general'
                              ? 'bg-white text-primary shadow-sm'
                              : 'text-primary-100 hover:text-white'
                          }`}
                        >
                          General Counseling
                        </button>
                      </div>

                      <div>
                        <h2 className="font-heading text-xl sm:text-2xl font-bold">
                          {inquiryType === 'demo' ? 'Reserve Your 100% Free Live Demo Class' : 'Course Inquiry & Fee Counseling'}
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-primary-100 leading-snug">
                          {inquiryType === 'demo'
                            ? 'Experience our Cambridge-certified teaching method with 0 upfront fee. Confirm your slot in 30 seconds.'
                            : 'Get batch timings, syllabus breakdown, and personalized guidance for Surat campuses or online.'}
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-xl bg-red-950/60 border border-red-500/40 p-3.5 text-xs font-semibold text-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-xs font-semibold text-primary-100 mb-1">
                            Your Full Name <span className="text-secondary">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Hardik Patel"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                          />
                        </div>

                        {/* Phone / WhatsApp */}
                        <div>
                          <label htmlFor="phone" className="block text-xs font-semibold text-primary-100 mb-1">
                            WhatsApp / Mobile Number <span className="text-secondary">*</span>
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            placeholder="+91 98765 43210"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                          />
                          <p className="mt-1 text-[11px] text-primary-200/80">
                            We will send your demo batch timings and course brochure on WhatsApp.
                          </p>
                        </div>

                        {/* Program / Course Selection */}
                        <div>
                          <span className="block text-xs font-semibold text-primary-100 mb-1">
                            Course / Service Interested In
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-white/15 transition-colors">
                                <div className="flex items-center gap-2.5 truncate">
                                  <BookOpen className="h-4 w-4 text-white/50 shrink-0" />
                                  <span className="font-medium truncate">{form.course}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-white/50 shrink-0 ml-2" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto z-50">
                              <DropdownMenuHighlight>
                                {INQUIRY_COURSES.map((c) => (
                                  <DropdownMenuHighlightItem key={c}>
                                    <DropdownMenuItem onClick={() => setForm((f) => ({ ...f, course: c }))}>
                                      {c}
                                    </DropdownMenuItem>
                                  </DropdownMenuHighlightItem>
                                ))}
                              </DropdownMenuHighlight>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Preferred Campus / Branch */}
                        <div>
                          <span className="block text-xs font-semibold text-primary-100 mb-1">
                            Preferred Campus / Learning Mode
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white cursor-pointer hover:bg-white/15 transition-colors">
                                <div className="flex items-center gap-2.5 truncate">
                                  <MapPin className="h-4 w-4 text-white/50 shrink-0" />
                                  <span className="font-medium truncate">{form.branch}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-white/50 shrink-0 ml-2" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto z-50">
                              <DropdownMenuHighlight>
                                {BRANCH_OPTIONS.map((b) => (
                                  <DropdownMenuHighlightItem key={b}>
                                    <DropdownMenuItem onClick={() => setForm((f) => ({ ...f, branch: b }))}>
                                      {b}
                                    </DropdownMenuItem>
                                  </DropdownMenuHighlightItem>
                                ))}
                              </DropdownMenuHighlight>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Optional Questions */}
                        <div>
                          <label htmlFor="message" className="block text-xs font-semibold text-primary-100 mb-1">
                            Preferred Batch Timing / Questions <span className="text-white/50 text-[10px] font-normal">(Optional)</span>
                          </label>
                          <textarea
                            id="message"
                            rows={2}
                            value={form.message}
                            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                            placeholder="e.g. Morning 8am or Evening 7pm batch, fee breakdown"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* Primary Form Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-warm mt-3 w-full justify-center py-3.5 cursor-pointer disabled:opacity-75 font-semibold text-sm shadow-soft-lg flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>Submitting Your Request...</span>
                          </>
                        ) : (
                          <>
                            <CalendarCheck className="h-4 w-4" />
                            <span>
                              {inquiryType === 'demo' ? 'Reserve My Free Live Demo Class 🚀' : 'Request Instant Callback'}
                            </span>
                          </>
                        )}
                      </button>

                      {/* Or Divider */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex-1 h-px bg-white/20" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">OR QUICK CHAT</span>
                        <div className="flex-1 h-px bg-white/20" />
                      </div>

                      {/* Dynamic Instant WhatsApp 1-Click Inquiry Button */}
                      <a
                        href={dynamicWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('whatsapp_click', { placement: 'contact_form_dynamic', course: form.course, branch: form.branch })}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 text-xs font-bold shadow-md transition-all hover:scale-[1.01]"
                      >
                        <MessageCircle className="h-4 w-4 fill-current" />
                        <span>Inquire Instantly on WhatsApp (+91 84888 05888)</span>
                      </a>

                      <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-primary-200/90 text-center">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> 100% Free & Confidential
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Certified Counselors
                        </span>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* 
                Contact Information Column:
                Placed SECOND on mobile (order-2 lg:order-1)
              */}
              <div className="order-2 lg:order-1 p-6 sm:p-8 lg:p-12 lg:col-span-2 flex flex-col justify-between space-y-8 bg-white border-t lg:border-t-0 lg:border-r border-black/5">
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-ink">
                      Contact Information
                    </h2>
                    <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">
                      Reach out directly via phone or WhatsApp, or visit any of our 4 official campuses in Surat.
                    </p>
                  </div>

                  {/* Contact Methods */}
                  <div className="space-y-3">
                    {CONTACT_ITEMS.map((item) => (
                      <a
                        key={item.title}
                        href={item.action}
                        className="group flex gap-3.5 rounded-2xl border border-black/5 bg-bg-soft p-3.5 transition-all hover:border-primary/20 hover:shadow-soft"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-ink text-xs">{item.title}</p>
                          {item.lines.map((line) => (
                            <p key={line} className="text-xs text-ink-muted leading-snug font-medium">
                              {line}
                            </p>
                          ))}
                          <p className="text-[10px] text-primary font-semibold mt-0.5">{item.hint}</p>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Campus Quick List */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="font-bold text-ink text-xs uppercase tracking-wider text-ink-soft">
                        Our 4 Surat Campuses
                      </p>
                      <Link href="/branches" className="text-[11px] font-bold text-primary hover:underline">
                        View All →
                      </Link>
                    </div>

                    <div className="space-y-2.5">
                      {BRANCHES.map((branch) => (
                        <div
                          key={branch.title}
                          className="flex gap-2.5 rounded-xl border border-black/5 bg-bg-soft p-3 transition-all hover:border-primary/20 hover:bg-white"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-ink text-xs leading-snug">{branch.title}</p>
                            <p className="text-[11px] text-ink-muted leading-tight mt-0.5 line-clamp-1">
                              {branch.address}
                            </p>
                            <div className="mt-1 flex items-center gap-3">
                              <Link
                                href={`/branches/${branch.slug}`}
                                className="text-[10px] font-bold text-primary hover:underline"
                              >
                                Campus Details →
                              </Link>
                              <a
                                href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                                className="text-[10px] font-semibold text-ink-soft hover:text-primary flex items-center gap-1"
                              >
                                <Phone className="h-2.5 w-2.5" /> Call Campus
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trust Footer */}
                <div className="space-y-3 pt-6 border-t border-black/5">
                  <div className="rounded-2xl bg-primary-50 p-4 text-center">
                    <div className="flex justify-center mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-ink">
                      Surat&apos;s #1 Spoken English & Visa Academy
                    </p>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      5,000+ Successful Students • Established 2005
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <WaveDivider position="bottom" fillColor="text-white" variant={2} className="mt-8 lg:mt-12" />
        </section>

        {/* ── Google Maps Location Section ── */}
        <section className="relative bg-white py-16 lg:py-24">
          <div className="container-x">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                Surat Offline Centers
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink">
                Visit Us in Person Across Surat
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Choose the center nearest to your home or college for in-person counseling and free trial sessions.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {BRANCHES.map((branch) => (
                <div
                  key={branch.title}
                  className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-soft transition-all hover:shadow-soft-lg"
                >
                  {branch.embedMap && (
                    <div className="h-52 relative w-full overflow-hidden border-b border-black/5 bg-bg-soft">
                      {!mapsLoaded[branch.title] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-bg-soft z-10">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                      )}
                      <iframe
                        src={branch.embedMap}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full h-full"
                        onLoad={() => setMapsLoaded((prev) => ({ ...prev, [branch.title]: true }))}
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <h3 className="font-heading font-bold text-ink text-sm">{branch.title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed min-h-[32px]">{branch.address}</p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <Link
                        href={`/branches/${branch.slug}`}
                        className="btn-primary inline-flex text-xs py-2 px-3.5"
                      >
                        Campus Details →
                      </Link>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(branch.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-black/10 bg-bg-soft px-3.5 py-2 text-xs font-semibold text-ink hover:bg-black/5 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Navigation className="h-3 w-3 text-secondary" />
                        Directions
                      </a>
                      <a
                        href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                        className="rounded-xl border border-emerald-500/20 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="h-3 w-3 text-emerald-600" />
                        Call Center
                      </a>
                    </div>
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

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-soft flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}