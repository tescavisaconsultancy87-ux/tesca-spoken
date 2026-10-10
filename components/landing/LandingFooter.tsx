'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LANDING_CONFIG } from '@/lib/data/spokenEnglishLanding';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-16 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl border border-slate-700 shadow-sm inline-flex">
                <Image
                  src="/Tesca_logo.png"
                  alt="TESCA VISA CONSULTANCY & SPOKEN ENGLISH"
                  width={150}
                  height={38}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering students, professionals, and homemakers with practical everyday English speaking skills and natural conversational confidence through structured online mobile learning on Class Plus.
            </p>
            <div className="space-y-2 pt-2 text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#067779] flex-shrink-0" />
                <span>110,111,112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka, Surat, Gujarat</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>+91 84888 05888</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F97823] flex-shrink-0" />
                <span>tescavisaconsultancy87@gmail.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-white text-xs uppercase tracking-wider">
              Course
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-white transition-colors">
                  What You&apos;ll Learn
                </a>
              </li>
              <li>
                <a href="#demo-lesson" className="hover:text-white transition-colors">
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Course Pricing
                </a>
              </li>
              <li>
                <a href="#app" className="hover:text-white transition-colors">
                  Class Plus App
                </a>
              </li>
            </ul>
          </div>

          {/* Institute Info */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-white text-xs uppercase tracking-wider">
              About & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About TESCA
                </Link>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Learner Reviews
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-white text-xs uppercase tracking-wider">
              Legal & Terms
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>
            © {currentYear} {LANDING_CONFIG.brandName}. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-500">
            Hosted & delivered via Class Plus Mobile Learning Infrastructure.
          </p>
        </div>
      </div>
    </footer>
  );
}
