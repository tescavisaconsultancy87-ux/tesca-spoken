'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Check,
  Send,
  Bell,
} from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/data/content';
import { motion, AnimatePresence } from 'framer-motion';

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
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Success Stories', href: '/#success' },
  { label: 'Free English Test', href: '/assessment' },
];

const COURSE_LINKS = [
  { label: 'Spoken English Basic', href: '/courses' },
  { label: 'Spoken English Advanced', href: '/courses' },
  { label: 'IELTS Preparation', href: '/courses' },
  { label: 'PTE Preparation', href: '/courses' },
  { label: 'Interview Preparation', href: '/courses' },
];

const SOCIAL_LINKS = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!subscribed) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const springConfig = {
    type: 'spring',
    stiffness: 240,
    damping: 18,
    mass: 1.1,
  } as const;

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

          <div className="flex w-full max-w-md items-center justify-center lg:justify-end">
            <motion.div
              layout
              transition={springConfig}
              style={{ borderRadius: 32 }}
              className={`relative flex items-center overflow-hidden border border-white/15 transition-colors duration-300 ${
                subscribed
                  ? 'w-72 bg-white/5 p-1 shadow-lg'
                  : 'w-auto bg-transparent p-0'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {subscribed && (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={springConfig}
                    className="flex flex-1 items-center px-4"
                  >
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      Subscribed! 🎉
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                layout
                onClick={handleSubscribeToggle}
                transition={springConfig}
                className={`relative flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                  subscribed
                    ? 'bg-white px-4 py-2.5 text-primary-900 text-xs hover:bg-[#fafafa]'
                    : 'bg-secondary px-6 py-3.5 text-white hover:bg-secondary-600'
                }`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {!subscribed && (
                    <motion.span
                      key="bell-icon"
                      layout
                      className="origin-right"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={springConfig}
                    >
                      <Bell className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.span layout="position" className="text-sm tracking-tight">
                  {subscribed ? 'Done' : 'Subscribe'}
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Company info */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center justify-center bg-white rounded-2xl px-5 py-3 shadow-sm transition-transform hover:scale-[1.02] duration-300">
              <Image src="/Tesca_logo.png" alt="TESCA Logo" width={140} height={32} className="h-8 w-auto object-contain" />
            </Link>
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
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-primary-200 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    {link.label}
                  </Link>
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
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-primary-200 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    {link.label}
                  </Link>
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
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-primary-300">
            &copy; {new Date().getFullYear()} TESCA Spoken English. All rights
            reserved.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-xs text-primary-300 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-primary-300 transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/refund"
                className="text-xs text-primary-300 transition-colors hover:text-white"
              >
                Refund Policy
              </Link>
            </div>
            <a
              href="https://portfolio-avadh.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary-300 transition-colors hover:text-white sm:border-l sm:border-white/15 sm:pl-6"
            >
              <span>Developed & Managed by</span>
              <strong className="font-bold text-white">AD</strong>
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block ml-0.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
