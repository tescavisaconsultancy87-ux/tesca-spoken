'use client';

import { ArrowRight, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { metaTracking } from '@/lib/metaPixel';

export default function FinalCtaSection() {
  const handleFinalCta = () => {
    metaTracking.ctaClick('final-cta-section', 'START LEARNING NOW');
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#067779] via-[#056062] to-[#043d3d] text-white relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-white/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#F97823]/20 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl p-8 sm:p-14 shadow-2xl">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Your English Journey Starts Now
          </span>

          <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Ready to Speak English With More Confidence?
          </h2>

          <p className="mt-4 text-base sm:text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed font-medium">
            Start learning practical English today and build your speaking skills step by step.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              onClick={handleFinalCta}
              className="inline-flex items-center justify-center gap-3 px-10 py-4.5 rounded-full bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-black text-lg shadow-xl shadow-orange-950/30 hover:shadow-orange-950/50 hover:scale-[1.03] active:scale-[0.99] transition-all focus:outline-none focus:ring-4 focus:ring-orange-400/40 cursor-pointer"
            >
              <span>START LEARNING NOW</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-teal-100 font-semibold">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>Learn through Class Plus</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Instant Mobile Access</span>
            </div>
            <span>•</span>
            <span>Beginner Friendly</span>
          </div>
        </div>
      </div>
    </section>
  );
}
