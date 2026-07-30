'use client';

import { useState, memo, useCallback } from 'react';
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
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Success Stories', href: '/#success' },
  { label: 'Free English Test', href: '/assessment' },
  { label: 'Study Abroad (Visa)', href: 'https://tescavisa.com', external: true },
];

const COURSE_LINKS = [
  { label: 'Spoken English Basic', href: '/courses' },
  { label: 'Spoken English Advanced', href: '/courses' },
  { label: 'IELTS Preparation', href: '/courses' },
  { label: 'PTE Preparation', href: '/courses' },
  { label: 'Interview Preparation', href: '/courses' },
];

const SOCIAL_LINKS = [
  { icon: Youtube, href: 'https://www.youtube.com/@tescaspokenenglishandielts6122', label: 'YouTube' },
  { icon: Instagram, href: 'https://www.instagram.com/tescaspokenenglish', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/tescaspoken', label: 'Facebook' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/tesca-spoken-english', label: 'LinkedIn' },
];

const BRANCHES = [
  {
    name: 'Sarthana',
    address: '110,111,112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka, Surat.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=110,111,112+Royal+Arcade,+Opp.+Deep+Kamal+Mall,+Sarthana+Jakatnaka,+Surat',
  },
  {
    name: 'Mota Varachha',
    address: '106-107, Ambika Pinnacle, Lajamani Chowk, Mota Varachha, Surat.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=106-107,+Ambika+Pinnacle,+Lajamani+Chowk,+Mota+Varachha,+Surat',
  },
  {
    name: 'Hirabaug',
    address: '39, Ambika Vijay Soc., 2nd Floor, Near Surat Super Store, Hirabaug, Surat.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=39,+Ambika+Vijay+Soc.,+2nd+Floor,+Near+Surat+Super+Store,+Hirabaug,+Surat',
  },
  {
    name: 'Yogichowk',
    address: '2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk, Surat.',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=2nd+Floor,+Bhavna+Park+Soc.,+Opp.+Paladium+Mall,+Above+Prasang+Fashion,+Yogichowk,+Surat',
  },
];

const Footer = memo(function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribeToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!subscribed) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
    }
  }, [subscribed]);

  const springConfig = {
    type: 'spring',
    stiffness: 240,
    damping: 18,
    mass: 1.1,
  } as const;

  return (
    <footer id="contact" className="relative w-full text-white">
      {/* Wave Section Top Transition Shape */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none -mb-px z-10">
        <svg
          className="relative block w-full h-10 sm:h-14 md:h-20 lg:h-24 text-primary-900 fill-current"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,32 C320,95 480,10 720,50 C960,90 1180,15 1440,40 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* Main Footer Container */}
      <div className="relative overflow-hidden bg-primary-900">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container-x relative z-10 pt-4 pb-12 lg:pb-14">
          {/* Newsletter */}
          <div className="flex flex-col items-center justify-between gap-6 pb-10 lg:flex-row">
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

          {/* Glowing Gradient Line Divider */}
          <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

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
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Quick Links
              </h4>
              <ul className="mt-4 space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-1.5 text-xs text-primary-200 transition-colors hover:text-white"
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
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Courses
              </h4>
              <ul className="mt-4 space-y-2.5">
                {COURSE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-xs text-primary-200 transition-colors hover:text-white"
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
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
                Get in Touch
              </h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-primary-200">
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                  <span>
                    <a href="tel:+918488805888" className="hover:text-white transition-colors block">+91 84888 05888</a>
                    <a href="tel:+919925060609" className="hover:text-white transition-colors block">+91 99250 60609</a>
                  </span>
                </li>
                <li>
                  <a
                    href="mailto:tescavisaconsultancy87@gmail.com"
                    className="flex items-center gap-2.5 text-xs text-primary-200 transition-colors hover:text-white"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-secondary" />
                    tescavisaconsultancy87@gmail.com
                  </a>
                </li>
              </ul>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-warm mt-5 w-full justify-center text-xs py-2.5"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Glowing Gradient Line Divider */}
          <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Horizontal Our Branches Section */}
          <div>
            <div className="mb-4 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
              <h4 className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-white">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>Our Branches</span>
              </h4>
              <span className="text-[11px] font-medium text-primary-300">
                4 Locations Across Surat
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {BRANCHES.map((branch) => (
                <a
                  key={branch.name}
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-secondary/40 hover:bg-white/10 hover:shadow-lg hover:shadow-secondary/5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading text-xs font-bold text-white transition-colors group-hover:text-secondary">
                        {branch.name}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-300 transition-transform group-hover:translate-x-0.5">
                        Surat &rarr;
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-primary-200 transition-colors group-hover:text-white/90">
                      {branch.address}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Glowing Gradient Line Divider */}
          <div className="mt-10 mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
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
      </div>
    </footer>
  );
});

export default Footer;

