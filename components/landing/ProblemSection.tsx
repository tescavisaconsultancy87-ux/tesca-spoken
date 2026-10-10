'use client';

import { Ear, Languages, AlertCircle, MessageSquareOff, ArrowDown } from 'lucide-react';
import { PROBLEM_CARDS } from '@/lib/data/spokenEnglishLanding';

export default function ProblemSection() {
  const iconMap: Record<string, React.ReactNode> = {
    Ear: <Ear className="w-6 h-6 text-rose-600" />,
    Languages: <Languages className="w-6 h-6 text-[#F97823]" />,
    AlertCircle: <AlertCircle className="w-6 h-6 text-amber-600" />,
    MessageSquareOff: <MessageSquareOff className="w-6 h-6 text-rose-600" />,
  };

  return (
    <section id="problem" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Section Pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-4 shadow-xs">
          Common Speaking Roadblocks
        </div>

        {/* Section Heading */}
        <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight max-w-3xl mx-auto">
          You Know English. But Do You Struggle to Speak It?
        </h2>
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Most learners in India face the exact same invisible barriers. Do any of these sound familiar to your daily life?
        </p>

        {/* 4 Problem Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {PROBLEM_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className="group relative bg-white hover:bg-white border border-slate-200/90 hover:border-amber-400 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/5 flex flex-col justify-between"
            >
              <div>
                {/* Header Icon + Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {iconMap[card.iconName]}
                  </div>
                  <span className="text-xs font-black text-slate-300 group-hover:text-amber-500 transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                {/* Problem Title */}
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-2 group-hover:text-[#067779] transition-colors leading-snug">
                  {card.title}
                </h3>

                {/* Problem Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Subtle Tag */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                <span>The barrier: Mental translation block</span>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion / Mindset Shift Box in TESCA Teal */}
        <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-[#067779] to-[#04504f] text-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-teal-900/15">
          <div className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center mx-auto mb-3">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-teal-50 leading-snug">
            The problem isn’t that you can’t learn English.
          </p>
          <p className="mt-1.5 text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
            You need the right practice and a structured learning system.
          </p>
        </div>
      </div>
    </section>
  );
}
