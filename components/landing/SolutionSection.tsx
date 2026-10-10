'use client';

import { Mic, Lightbulb, Target, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { SOLUTION_PILLARS } from '@/lib/data/spokenEnglishLanding';

export default function SolutionSection() {
  const iconMap: Record<string, React.ReactNode> = {
    Mic: <Mic className="w-6 h-6 text-[#067779]" />,
    Lightbulb: <Lightbulb className="w-6 h-6 text-[#F97823]" />,
    Target: <Target className="w-6 h-6 text-emerald-600" />,
    TrendingUp: <TrendingUp className="w-6 h-6 text-sky-600" />,
  };

  const journeySteps = ['Learn', 'Practice', 'Speak', 'Improve'];

  return (
    <section id="solution" className="py-20 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-[#067779] border border-teal-200 mb-3 shadow-xs">
            The TESCA Solution
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            A Practical Way to Improve Your Spoken English
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Instead of simply memorizing grammar rules and dry vocabulary lists, our course focuses on{' '}
            <strong className="text-[#067779] font-bold underline decoration-[#F97823] decoration-2 underline-offset-4">
              using English actively
            </strong>{' '}
            in realistic everyday communication.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLUTION_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center">
                    {iconMap[pillar.iconName]}
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                    Step {pillar.step}
                  </span>
                </div>
                <h3 className="font-heading font-black text-xl text-slate-900">
                  {pillar.title}
                </h3>
                <p className="text-xs font-bold text-[#067779] uppercase tracking-wider mt-0.5 mb-2.5">
                  {pillar.subtitle}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Action-oriented practice</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Representation of the Learning Journey */}
        <div className="mt-12 bg-gradient-to-r from-teal-50/60 via-slate-50 to-amber-50/60 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#067779] text-center mb-6">
            The Continuous Fluency Loop
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-8">
            {journeySteps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3 sm:gap-4 md:gap-8">
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white border border-slate-200/90 text-slate-900 font-bold text-sm sm:text-base shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-[#067779] text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < journeySteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-[#F97823] hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
