'use client';

import { useState } from 'react';
import { Check, ShieldCheck, Zap, ArrowRight, Sparkles, CreditCard, Smartphone } from 'lucide-react';
import { LANDING_CONFIG } from '@/lib/data/spokenEnglishLanding';
import { metaTracking } from '@/lib/metaPixel';

export default function PricingOfferSection() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    metaTracking.initiateCheckout(LANDING_CONFIG.courseName, LANDING_CONFIG.actualPrice);
    metaTracking.ctaClick('pricing-card', 'BUY THE COURSE');

    if (LANDING_CONFIG.appLink && LANDING_CONFIG.appLink !== '#pricing') {
      window.location.href = LANDING_CONFIG.appLink;
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        window.open(LANDING_CONFIG.playStoreLink, '_blank');
      }, 400);
    }
  };

  const inclusions = [
    'Full access to all 6 Spoken English modules',
    `${LANDING_CONFIG.numberOfLessons} structured step-by-step video & audio lessons`,
    'Class Plus Mobile App access on Android & iOS',
    'Practical everyday speaking drills & roleplay scripts',
    'Audio conversation practice with native intonation models',
    'Course completion certificate eligibility upon finishing',
    `${LANDING_CONFIG.accessPeriod} unlimited re-watch validity`,
  ];

  return (
    <section id="pricing" className="py-20 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Genuine Limited-Time Urgency Banner (Section 16) */}
        <div className="max-w-3xl mx-auto mb-10 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 sm:p-5 text-center shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F97823] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Zap className="w-3 h-3 fill-white" />
              LIMITED-TIME COURSE OFFER
            </span>
            <span className="text-slate-800">
              Get the complete course for <span className="text-[#F97823] font-black">{LANDING_CONFIG.actualPrice}</span>
            </span>
            <span className="text-slate-500">
              • Offer ends: <span className="text-slate-800 font-bold">{LANDING_CONFIG.offerExpiryDate}</span>
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-[#067779] border border-teal-200 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Transparent Pricing
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
            Start Improving Your English Today
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            One single investment for lifelong spoken English clarity, career advancement, and conversational freedom.
          </p>
        </div>

        {/* Premium Pricing Card */}
        <div className="mt-12 max-w-xl mx-auto bg-white border-2 border-teal-300 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-teal-950/10 relative">
          {/* Card Top Pill */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F97823] to-[#e45f0e] text-white text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
            BEST VALUE SPOKEN ENGLISH BATCH
          </div>

          {/* Pricing Header */}
          <div className="text-center pb-8 border-b border-slate-100">
            <h3 className="font-heading font-black text-2xl text-slate-900 mb-1">
              {LANDING_CONFIG.courseName}
            </h3>
            <p className="text-xs text-slate-500 mb-5 font-semibold">
              Instant mobile unlocking via Class Plus app
            </p>

            <div className="flex items-baseline justify-center gap-3">
              <span className="text-xl sm:text-2xl text-slate-400 line-through font-bold">
                {LANDING_CONFIG.originalPrice}
              </span>
              <span className="font-heading font-black text-4xl sm:text-5xl text-[#067779] tracking-tight">
                {LANDING_CONFIG.actualPrice}
              </span>
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1.5">
              One-time payment • No hidden subscriptions
            </p>
          </div>

          {/* Course Inclusions Checklist */}
          <div className="py-7 space-y-3.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Everything Included In This Course:
            </p>
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-teal-50 text-[#067779] border border-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Primary Buy CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-black text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-75 cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-400/40"
            >
              <span>{isProcessing ? 'Opening Checkout...' : 'BUY THE COURSE'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Reassurance text */}
            <div className="mt-4 text-center space-y-1.5">
              <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure payment • Instant access after purchase</span>
              </p>
              <p className="text-[11px] text-slate-500">
                No complicated process. Choose the course, complete your purchase and start learning.
              </p>
            </div>

            {/* Supported Payment Badges */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-slate-500 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#067779]" /> UPI / GPay / PhonePe
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#F97823]" /> Cards & NetBanking
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
