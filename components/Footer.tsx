'use client';

import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Check,
  Send,
} from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/data/content';

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="currentColor" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#why-tesca' },
  { label: 'Courses', href: '#courses' },
  { label: 'Success Stories', href: '#success' },
  { label: 'Free English Test', href: '#start-test' },

];

const COURSE_LINKS = [
  { label: 'Spoken English Basic', href: '#courses' },
  { label: 'Spoken English Advanced', href: '#courses' },
  { label: 'IELTS Preparation', href: '#courses' },
  { label: 'PTE Preparation', href: '#courses' },
  { label: 'Interview Preparation', href: '#courses' },
];

const SOCIAL_LINKS = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-primary-900 text-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container-x relative z-10 py-16 lg:py-20">
        {/* Newsletter */}
        <div className="mb-14 flex flex-col items-center justify-between gap-6 border-b border-white/10 pb-14 lg:flex-row">
          <div className="text-center lg:text-left">
            <h3 className="font-heading text-2xl font-bold text-white">
              Never miss a learning tip
            </h3>
            <p className="mt-2 text-sm text-primary-200">
              Join our newsletter for free English lessons, IELTS tips, and
              course updates.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full border-2 border-white/15 bg-white/10 px-5 py-3.5 pl-11 text-sm text-white placeholder:text-primary-200/60 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
                  aria-label="Email address"
                />
              </div>
              <button type="submit" className="btn-warm whitespace-nowrap">
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    Subscribed
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Subscribe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Main footer grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Company info */}
          <div className="lg:col-span-4">
            <a href="#home" className="flex items-center gap-2">
              <img src="/Tesca_logo.png" alt="TESCA Logo" className="h-9 w-auto object-contain brightness-0 invert" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-200">
              TESCA Spoken English is a premier institute dedicated to
              transforming communication skills since 2005. Expert-led spoken
              English, IELTS, and PTE training for students and professionals.
            </p>

            {/* Social */}
            <div className="mt-5 flex gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary-200 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-primary-200 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              Courses
            </h4>
            <ul className="mt-4 space-y-2.5">
              {COURSE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-primary-200 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              Get in Touch
            </h4>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-3 text-sm text-primary-200">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>
                  <a href="tel:+919824152731" className="hover:text-white transition-colors block">+91 98241 52731</a>
                  <a href="tel:+919925060609" className="hover:text-white transition-colors block">+91 99250 60609</a>
                </span>
              </li>
              <li>
                <a
                  href="mailto:tescavisaconsultancy87@gmail.com"
                  className="flex items-center gap-3 text-sm text-primary-200 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 shrink-0 text-secondary" />
                  tescavisaconsultancy87@gmail.com
                </a>
              </li>
            </ul>

            <h4 className="font-heading text-xs font-bold uppercase tracking-wide text-white mt-6">
              Our Branches
            </h4>
            <ul className="mt-3 space-y-2.5">
              <li className="flex items-start gap-3 text-xs text-primary-200">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                <span><strong className="text-white">Sarthana:</strong> 110,111,112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka, Surat.</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-primary-200">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                <span><strong className="text-white">Mota Varachha:</strong> 106-107, Ambika Pinnacle, Lajamani Chowk, Mota Varachha, Surat.</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-primary-200">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                <span><strong className="text-white">Hirabaug:</strong> 39, Ambika Vijay Soc., 2nd Floor, Near Surat Super Store, Hirabaug, Surat.</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-primary-200">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                <span><strong className="text-white">Yogichowk:</strong> 2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk, Surat.</span>
              </li>
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-warm mt-5 w-full"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-primary-300">
            &copy; {new Date().getFullYear()} TESCA Spoken English. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#privacy"
              className="text-xs text-primary-300 transition-colors hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-xs text-primary-300 transition-colors hover:text-white"
            >
              Terms of Service
            </a>
            <a
              href="#refund"
              className="text-xs text-primary-300 transition-colors hover:text-white"
            >
              Refund Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
