'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LANDING_CONFIG } from '@/lib/data/spokenEnglishLanding';
import { metaTracking } from '@/lib/metaPixel';

export default function MobileStickyBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-[#067779] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F97823]" />
            Class Plus Course
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-slate-400 line-through font-semibold">
              {LANDING_CONFIG.originalPrice}
            </span>
            <span className="text-base font-black text-slate-900">
              {LANDING_CONFIG.actualPrice}
            </span>
          </div>
        </div>

        <a
          href="#pricing"
          onClick={() => metaTracking.ctaClick('mobile-sticky-bar', 'START LEARNING →')}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-black text-sm shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <span>START LEARNING</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
