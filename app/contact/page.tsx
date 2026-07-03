'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { WHATSAPP_URL } from '@/lib/data/content';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
  DropdownMenuItem,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';

const FEEDBACK_TYPES = [
  'Suggestion',
  'General Feedback',
  'Bug Report / Website Issue',
  'Business Inquiry',
  'Other',
];

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+91 98241 52731', '+91 99250 60609'],
    hint: 'Mon – Sat, 9am – 7pm',
    action: 'tel:+919824152731',
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
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.52982230402!2d72.73989467475143!3d21.15918020304383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1783070800000!5m2!1sen!2sin',
  },
  {
    title: 'Branch 4 - Yogichowk',
    address: '2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk, Surat.',
    embedMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.4620727097463!2d72.88151159678955!3d21.21351790000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f00099b1a45%3A0x790d12f6f9c10d20!2sTESCA%20SPOKEN%20ENGLISH%20%26%20COMPUTER%20EDUCATION!5e0!3m2!1sen!2sin!4v1783070752116!5m2!1sen!2sin',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'Suggestion',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          name: form.name,
          email: form.email,
          topic: form.type,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit feedback.');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-soft">
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-40 pb-16 lg:pt-48 lg:pb-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          <div className="container-x relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  Share Your Thoughts
                </span>
                <h1 className="font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  Feedback &{' '}
                  <span className="gradient-text">Suggestions</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                  Help us make TESCA better. Whether you have an idea, a suggestion, or general
                  feedback, we are listening.
                </p>

                {/* Quick Metrics */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                  {[
                    { icon: ThumbsUp, text: 'Valued Opinions' },
                    { icon: MessageSquare, text: 'Direct to Founder' },
                    { icon: Clock, text: 'Review in < 24hrs' },
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
                  <img
                    src="/contact_hero.png"
                    alt="TESCA Contact Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Form Container ── */}
        <section className="pb-20 lg:pb-28">
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
                        Thank you for your feedback!
                      </h3>
                      <p className="mt-3 text-primary-100 max-w-sm text-sm leading-relaxed">
                        We appreciate your input. Our team reads every submission and continuously works to improve the TESCA experience.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({ name: '', email: '', type: 'Suggestion', message: '' });
                          setError('');
                        }}
                        className="btn-warm mt-8"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <h2 className="font-heading text-2xl font-bold">
                          Send Feedback
                        </h2>
                        <p className="mt-1 text-sm text-primary-100">
                          We review every suggestion to improve your learning experience.
                        </p>
                      </div>

                      {error && (
                        <div className="rounded-xl bg-red-950/50 border border-red-500/30 p-3.5 text-xs font-semibold text-red-200">
                          {error}
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-xs font-semibold text-primary-100 mb-1.5">
                            Full Name <span className="text-secondary">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Your name"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-xs font-semibold text-primary-100 mb-1.5">
                            Email Address <span className="text-secondary">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="your@email.com"
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                          />
                        </div>

                        {/* Feedback Type */}
                        <div>
                          <span className="block text-xs font-semibold text-primary-100 mb-1.5">
                            Topic
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white cursor-pointer hover:bg-white/15 transition-colors">
                                <div className="flex items-center gap-2.5">
                                  <HelpCircle className="h-4 w-4 text-white/50 shrink-0" />
                                  <span className="font-medium">{form.type}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-white/50" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto z-50">
                              <DropdownMenuHighlight>
                                {FEEDBACK_TYPES.map((t) => (
                                  <DropdownMenuHighlightItem key={t}>
                                    <DropdownMenuItem onClick={() => setForm((f) => ({ ...f, type: t }))}>
                                      {t}
                                    </DropdownMenuItem>
                                  </DropdownMenuHighlightItem>
                                ))}
                              </DropdownMenuHighlight>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Message */}
                        <div>
                          <label htmlFor="message" className="block text-xs font-semibold text-primary-100 mb-1.5">
                            Your Message <span className="text-secondary">*</span>
                          </label>
                          <textarea
                            id="message"
                            required
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                            placeholder="Tell us what's on your mind..."
                            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-warm mt-2 w-full justify-center py-3.5 cursor-pointer disabled:opacity-75"
                      >
                        {loading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Feedback
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Location Section ── */}
        <section className="pb-20 lg:pb-28">
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
                      <iframe
                        src={branch.embedMap}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="w-full h-full"
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