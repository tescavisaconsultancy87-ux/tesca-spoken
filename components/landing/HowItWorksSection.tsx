'use client';

import { Download, ShoppingBag, PlayCircle, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '@/lib/data/spokenEnglishLanding';
import { metaTracking } from '@/lib/metaPixel';

export default function HowItWorksSection() {
  const stepIcons = [
    <Download key="1" className="w-7 h-7 text-[#067779]" />,
    <ShoppingBag key="2" className="w-7 h-7 text-[#F97823]" />,
    <PlayCircle key="3" className="w-7 h-7 text-emerald-600" />,
  ];

  const visualFlow = ['Landing Page', 'Class Plus App', 'Select Course', 'Secure Payment', 'Start Speaking'];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 text-slate-900 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white border border-teal-200 text-[#067779] mb-3 shadow-xs">
            Simple 3-Step Process
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            Start Learning in 3 Simple Steps
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            No complicated paperwork or delays. You are only minutes away from starting your first practical English speaking lesson.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.stepNumber}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 relative hover:border-teal-300 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {stepIcons[idx]}
                  </div>
                  <span className="font-heading font-black text-4xl text-slate-200">
                    {step.stepNumber}
                  </span>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-[#067779] border border-teal-100 mb-2">
                  {step.badge}
                </span>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-slate-500">
                <span>Step {idx + 1} of 3</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Customer Journey Ribbon */}
        <div className="mt-14 bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#067779] mb-4">
            Visual Buying Flow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
            {visualFlow.map((stage, idx) => (
              <div key={stage} className="flex items-center gap-2 sm:gap-4">
                <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                  {stage}
                </span>
                {idx < visualFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#F97823] flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="#pricing"
            onClick={() => metaTracking.ctaClick('how-it-works-bottom', 'GET STARTED NOW')}
            className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-extrabold text-base shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <span>GET STARTED NOW</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
