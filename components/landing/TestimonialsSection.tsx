'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS_DATA } from '@/lib/data/spokenEnglishLanding';

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="py-20 bg-slate-50 text-slate-900 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white border border-teal-200 text-[#067779] mb-3 shadow-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Learner Feedback
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            What Our Learners Say
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Real feedback from students and professionals working toward everyday English speaking confidence.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between hover:border-teal-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  &quot;{t.text}&quot;
                </p>
              </div>

              {/* Author & Tag */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-heading font-extrabold text-sm text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#067779] font-bold">
                    {t.role} {t.location ? `• ${t.location}` : ''}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-teal-50 text-[#067779] flex items-center justify-center border border-teal-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Note on Testimonials */}
        <div className="mt-10 text-center max-w-2xl mx-auto">
          <p className="text-xs text-slate-500 italic">
            * Learner testimonials reflect individual practice consistency and personal experiences.
          </p>
        </div>
      </div>
    </section>
  );
}
