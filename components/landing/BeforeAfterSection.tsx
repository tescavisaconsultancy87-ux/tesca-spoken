'use client';

import { XCircle, CheckCircle, Sparkles } from 'lucide-react';
import { BEFORE_AFTER } from '@/lib/data/spokenEnglishLanding';

export default function BeforeAfterSection() {
  return (
    <section id="before-after" className="py-20 bg-white text-slate-900 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-[#067779] border border-teal-200 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Tangible Transformation
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            From Hesitation to Confidence
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            See the real, tangible shift when you replace passive memorization with active spoken practice.
          </p>
        </div>

        {/* Before vs After Split Grid */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: BEFORE */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-6 sm:p-8 relative shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-rose-700 text-xs font-extrabold tracking-wider uppercase mb-5 border border-rose-200 shadow-xs">
              Before This Course
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900 mb-4">
              Stuck in Hesitation
            </h3>
            <ul className="space-y-4">
              {BEFORE_AFTER.before.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: AFTER */}
          <div className="bg-teal-50/70 border-2 border-teal-300 rounded-3xl p-6 sm:p-8 relative shadow-md shadow-teal-900/5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#067779] text-white text-xs font-extrabold tracking-wider uppercase mb-5 shadow-xs">
              With Consistent Practice
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900 mb-4">
              Active Speaking Confidence
            </h3>
            <ul className="space-y-4">
              {BEFORE_AFTER.after.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Realistic Legal / Ethical Disclaimer Box */}
        <div className="mt-8 max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-slate-500 italic">
            * {BEFORE_AFTER.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
