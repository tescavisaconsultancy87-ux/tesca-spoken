'use client';

import { CheckCircle2, Smartphone, Clock, Compass, Users, Headphones, Star } from 'lucide-react';
import { WHY_US_FEATURES } from '@/lib/data/spokenEnglishLanding';

export default function WhyUsSection() {
  const iconMap: Record<string, React.ReactNode> = {
    CheckCircle2: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    Smartphone: <Smartphone className="w-6 h-6 text-[#067779]" />,
    Clock: <Clock className="w-6 h-6 text-[#F97823]" />,
    Compass: <Compass className="w-6 h-6 text-sky-600" />,
    Users: <Users className="w-6 h-6 text-indigo-600" />,
    Headphones: <Headphones className="w-6 h-6 text-purple-600" />,
  };

  return (
    <section id="why-us" className="py-20 bg-white text-slate-900 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-[#067779] border border-teal-200 mb-3 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-[#067779]" />
            Why Choose TESCA
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            Why Learn With Us?
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Engineered specifically to solve the real obstacles Indian learners face when trying to speak English fluently in daily life.
          </p>
        </div>

        {/* 6 Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US_FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center mb-5">
                  {iconMap[feature.iconName]}
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Advantage 0{idx + 1}</span>
                <span className="text-[#067779] font-bold">Included</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
