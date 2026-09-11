'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
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
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  ChevronDown,
  Award,
  BookOpen,
  GraduationCap,
  CalendarCheck,
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
    hint: 'Mon – Sat, 7am – 8pm',
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
    title: 'Branch 1 - Sarthana',
    address: '110,111,112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka, Surat.',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29754.938162078433!2d72.8858624!3d21.21728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f8647b359b3%3A0x11f64af5f5637cfe!2sTESCA%20VISA%20CONSULTANCY!5e0!3m2!1sen!2sin!4v1783070611318!5m2!1sen!2sin',
  },
  {
    title: 'Branch 2 - Mota Varachha',
    address: '106-107, Ambika Pinnacle, Lajamani Chowk, Mota Varachha, Surat.',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.8386097921198!2d72.88554337597363!3d21.238247480549106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fffa7abe0fb%3A0xd7c140b507f0e691!2sTESCA%20SPOKEN%20ENGLISH%20AND%20VISA%20COUNSULTANCY!5e0!3m2!1sen!2sin!4v1783070684461!5m2!1sen!2sin',
  },
  {
    title: 'Branch 3 - Hirabaug',
    address: '39, Ambika Vijay Soc., 2nd Floor, Near Surat Super Store, Hirabaug, Surat.',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1859.7143171918644!2d72.85818739660405!3d21.214844924916058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f003b425e37%3A0xbe2c90ec8201665e!2sTESCA%20ENGLISH%20SPOKEN!5e0!3m2!1sen!2sin!4v1783072796797!5m2!1sen!2sin',
  },
  {
    title: 'Branch 4 - Yogichowk',
    address: '2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk, Surat.',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.4620727097463!2d72.88151159678955!3d21.21351790000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f00099b1a45%3A0x790d12f6f9c10d20!2sTESCA%20SPOKEN%20ENGLISH%20%26%20COMPUTER%20EDUCATION!5e0!3m2!1sen!2sin!4v1783070752116!5m2!1sen!2sin',
  },
];

export default function ContactPage() {
  const [mapsLoaded, setMapsLoaded] = useState<Record<string, boolean>>({});
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
          message: form.message.trim() || `Course inquiry for ${form.course} (${form.branch})`,
          ...enrichment,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry.');
      }

      setSubmitted(true);
      toast.success('Your inquiry has been submitted! Our counseling team will call you shortly.', 'Inquiry Received');
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
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://tesca.co'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Contact Us',
        'item': 'https://tesca.co/contact'
      }
    ]
  };

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact TESCA Spoken English',
    'description': 'Contact details and branch locations for TESCA Spoken English in Surat.',
    'url': 'https://tesca.co/contact',
    'mainEntity': {
      '@type': 'EducationalBusiness',
      'name': 'TESCA Spoken English',
      'telephone': '+91 84888 05888',
      'areaServed': 'Surat, Gujarat, India',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Royal Arcade, Sarthana Jakatnaka / Ambika Pinnacle, Mota Varachha',
        'addressLocality': 'Surat',
        'addressRegion': 'Gujarat',
        'postalCode': '395006',
        'addressCountry': 'IN'
      }
    }
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
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-40 pb-0 lg:pt-48 lg:pb-0">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          <div className="container-x relative z-10 pb-8">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  Connect With Us • Free Counseling
                </span>
                <h1 className="font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  Get in Touch &{' '}
                  <span className="gradient-text">Start Learning</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                  Have questions about our Spoken English, IELTS, or PTE courses? Speak with our senior counselors for batch timings, fee structures, and book your 100% free live demo class.
                </p>

                {/* Quick Metrics */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                  {[
                    { icon: Award, text: 'Free Demo Class' },
                    { icon: MessageCircle, text: 'Instant WhatsApp Reply' },
                    { icon: Clock, text: 'Callback in < 15 Mins' },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-2 rounded-full bg-white border border-black/8 px-4 py-2 text-xs font-medium text-ink-soft shadow-soft"
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Generated Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px] lg:max-w-none aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-soft-lg">
                  <Image
                    src="/contact_hero.png"
                    alt="TESCA Contact Illustration"
                    fill
                    priority
                    sizes="(max-width: 768px) 380px, 450px"
                    className="object-contain p-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <WaveDivider position="bottom" fillColor="text-[#F8FAFC]" variant={1} className="mt-6" />
        </section>

        {/* ── Main Form Container ── */}
        <section className="relative bg-bg-soft pt-16 pb-0 lg:pt-20 lg:pb-0">
          <div className="container-x">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-soft-xl grid lg:grid-cols-5">
              
              {/* Left Column: Contact Details (White bg) */}
              <div className="p-8 lg:p-12 lg:col-span-2 flex flex-col justify-between space-y-8 bg-white">
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-ink">
                      Contact Information
                    </h2>
                    <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                      Reach out directly through any of our official channels or visit our center.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {CONTACT_ITEMS.map((item) => (
                      <a
                        key={item.title}
                        href={item.action}
                        className="group flex gap-4 rounded-2xl border border-black/5 bg-bg-soft p-4 transition-all hover:border-primary/20 hover:shadow-soft"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-ink text-xs">{item.title}</p>
                          {item.lines.map((line) => (
                            <p key={line} className="text-xs text-ink-muted leading-snug">
                              {line}
                            </p>
                          ))}
                        </div>
                      </a>
                    ))}
                  </div>

                  <div>
                    <p className="font-bold text-ink text-xs mb-3">Our Branches</p>
                    <div className="space-y-3">
                      {BRANCHES.map((branch) => (
                        <div
                          key={branch.title}
                          className="flex gap-3 rounded-2xl border border-black/5 bg-bg-soft p-3 transition-all"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-ink text-[11px]">{branch.title}</p>
                            <p className="text-[11px] text-ink-muted leading-snug mt-0.5">{branch.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-black/5">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-warm w-full justify-center text-xs py-3"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Quick Chat on WhatsApp
                  </a>

                  {/* Trust Badge */}
                  <div className="rounded-xl bg-primary-50 p-4 text-center">
                    <div className="flex justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-[11px] font-semibold text-ink-soft">
                      Trusted by 5,000+ Students Worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Feedback Form (Brand Teal bg) */}
              <div className="p-8 lg:p-12 lg:col-span-3 bg-primary text-white relative">
                {/* Decorative blob inside form */}
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
                <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-secondary/10 blur-2xl" />

                <div className="relative z-10 h-full flex flex-col justify-center">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <Check className="h-8 w-8 text-secondary" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold">
                        Thank You! Inquiry Received 🎉
                      </h3>
                      <p className="mt-3 text-primary-100 max-w-sm text-sm leading-relaxed">
                        Our senior counselor will review your inquiry and call/WhatsApp you within 15 minutes to share batch schedules and confirm your free demo class.
                      </p>
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
                        className="btn-warm mt-8"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <h2 className="font-heading text-2xl font-bold">
                          Course Inquiry & Free Counseling
                        </h2>
                        <p className="mt-1 text-sm text-primary-100">
                          Get batch timings, fee structures, and reserve your 100% free demo class.
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-xl bg-red-950/50 border border-red-500/30 p-3.5 text-xs font-semibold text-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-3.5">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-xs font-semibold text-primary-100 mb-1">
                            Full Name <span className="text-secondary">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. Rahul Patel"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                          />
                        </div>

                        {/* Phone / WhatsApp */}
                        <div>
                          <label htmlFor="phone" className="block text-xs font-semibold text-primary-100 mb-1">
                            Phone / WhatsApp Number <span className="text-secondary">*</span>
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
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-xs font-semibold text-primary-100 mb-1">
                            Email Address <span className="text-white/50 text-[10px] font-normal">(Optional)</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="your@email.com"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                          />
                        </div>

                        {/* Program / Course of Interest */}
                        <div>
                          <span className="block text-xs font-semibold text-primary-100 mb-1">
                            Course Interested In
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

                        {/* Preferred Branch */}
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

                        {/* Questions / Notes */}
                        <div>
                          <label htmlFor="message" className="block text-xs font-semibold text-primary-100 mb-1">
                            Questions / Preferred Timings <span className="text-white/50 text-[10px] font-normal">(Optional)</span>
                          </label>
                          <textarea
                            id="message"
                            rows={2}
                            value={form.message}
                            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                            placeholder="e.g. Morning or evening batch preferred, fee details"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-warm mt-3 w-full justify-center py-3.5 cursor-pointer disabled:opacity-75 font-semibold text-sm shadow-soft-lg flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CalendarCheck className="h-4 w-4" />
                            Submit Inquiry & Request Call Back
                          </>
                        )}
                      </button>

                      {/* Direct WhatsApp Action Link */}
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition-all mt-2"
                      >
                        <MessageCircle className="h-4 w-4 text-[#25D366]" />
                        Chat Directly on WhatsApp (+91 84888 05888)
                      </a>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
          <WaveDivider position="bottom" fillColor="text-white" variant={2} className="mt-8 lg:mt-12" />
        </section>

        {/* ── Location Section ── */}
        <section className="relative bg-white py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl font-bold text-ink">Our Locations</h2>
              <p className="mt-2 text-sm text-ink-muted">Visit any of our 4 branches across Surat</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {BRANCHES.map((branch) => (
                <div
                  key={branch.title}
                  className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-soft transition-all hover:shadow-soft-lg"
                >
                  {branch.embedMap && (
                    <div className="h-56 relative w-full overflow-hidden border-b border-black/5 bg-bg-soft">
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
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-ink text-sm mb-1">{branch.title}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed min-h-[32px]">{branch.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(branch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary mt-3 inline-flex text-xs"
                    >
                      Open in Google Maps
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