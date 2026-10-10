'use client';

import { GraduationCap, Briefcase, Laptop, HeartHandshake, Sparkles, Smile } from 'lucide-react';
import { AUDIENCE_PERSONAS } from '@/lib/data/spokenEnglishLanding';

export default function AudienceSection() {
  const iconMap: Record<string, React.ReactNode> = {
    GraduationCap: <GraduationCap className="w-6 h-6 text-[#067779]" />,
    Briefcase: <Briefcase className="w-6 h-6 text-[#F97823]" />,
    Laptop: <Laptop className="w-6 h-6 text-emerald-600" />,
    HeartHandshake: <HeartHandshake className="w-6 h-6 text-rose-600" />,
    Sparkles: <Sparkles className="w-6 h-6 text-purple-600" />,
    Smile: <Smile className="w-6 h-6 text-sky-600" />,
  };

  return (
    <section id="audience" className="py-20 bg-slate-50 text-slate-900 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white border border-teal-200 text-[#067779] mb-3 shadow-xs">
            Target Learners
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            Is This Course For You?
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whoever you are, if hesitating in English holds you back, this practical curriculum is structured for your daily life.
          </p>
        </div>

        {/* 6 Persona Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUDIENCE_PERSONAS.map((persona) => (
            <div
              key={persona.title}
              className="bg-white border border-slate-200/90 hover:border-teal-300 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {iconMap[persona.iconName]}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-slate-900">
                      {persona.title}
                    </h3>
                    <p className="text-xs font-extrabold text-[#067779]">
                      {persona.tagline}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {persona.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#067779]" />
                <span>Tailored practical examples</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
