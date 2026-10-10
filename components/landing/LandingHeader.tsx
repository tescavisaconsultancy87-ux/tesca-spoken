'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';
import { metaTracking } from '@/lib/metaPixel';

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Course', href: '#course-overview' },
    { label: "What You'll Learn", href: '#curriculum' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleCtaClick = (source: string) => {
    metaTracking.ctaClick(source, 'Start Learning');
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo & Name */}
          <Link
            href="#hero"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#067779] rounded-xl p-1"
          >
            <div className="flex items-center">
              <Image
                src="/Tesca_logo.png"
                alt="TESCA VISA CONSULTANCY & SPOKEN ENGLISH"
                width={170}
                height={44}
                priority
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left pl-3 border-l border-slate-200">
              <span className="font-heading font-extrabold text-xs text-[#067779] uppercase tracking-wider">
                Online Spoken English
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                Powered by Class Plus
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Landing Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#067779] hover:bg-teal-50/60 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#067779]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Primary CTA & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+918488805888"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#067779] hover:bg-teal-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#067779]" />
              <span>+91 84888 05888</span>
            </a>

            <a
              href="#pricing"
              onClick={() => handleCtaClick('header-desktop')}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-[#067779] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#067779]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:text-[#067779] hover:bg-teal-50 rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <a
              href="#pricing"
              onClick={() => handleCtaClick('header-mobile-drawer')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#F97823] to-[#e45f0e] text-white font-bold text-base shadow-md shadow-orange-500/25"
            >
              <span>Start Learning Now</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
