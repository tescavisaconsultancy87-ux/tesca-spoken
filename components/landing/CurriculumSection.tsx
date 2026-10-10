'use client';

import { useState } from 'react';
import { CURRICULUM_MODULES } from '@/lib/data/spokenEnglishLanding';
import { metaTracking } from '@/lib/metaPixel';
import { ChevronDown, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

export default function CurriculumSection() {
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-2': true,
    'mod-3': false,
    'mod-4': false,
    'mod-5': false,
    'mod-6': false,
  });

  const toggleModule = (id: string, moduleNum: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    metaTracking.curriculumExpand(moduleNum);
  };

  return (
    <section id="curriculum" className="py-20 bg-white text-slate-900 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-[#067779] border border-teal-200 mb-3 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            Comprehensive Curriculum
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            What You&apos;ll Learn Inside the Course
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            6 progressive, masterfully sequenced modules designed to eliminate speech hesitation and build natural verbal confidence.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURRICULUM_MODULES.map((module) => {
            const isOpen = !!openModules[module.id];
            return (
              <div
                key={module.id}
                className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider bg-teal-100/70 border border-teal-200 text-[#067779]">
                      {module.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id, module.number)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#067779] hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#067779]"
                      aria-label={`Toggle topics for ${module.number}`}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#067779]' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-1">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    {module.tagline}
                  </p>

                  {/* Topics List */}
                  {isOpen && (
                    <ul className="space-y-2.5 pt-3 border-t border-slate-200/80 animate-in fade-in duration-200">
                      {module.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>{module.topics.length} Key Focus Areas</span>
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id, module.number)}
                    className="text-[#067779] hover:text-[#04504f] font-bold focus:outline-none cursor-pointer"
                  >
                    {isOpen ? 'Show less' : 'View topics'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Mid-way CTA */}
        <div className="mt-12 text-center">
          <a
            href="#pricing"
            onClick={() => metaTracking.ctaClick('curriculum-bottom', 'Start Learning Curriculum')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Unlock Full 6 Modules in Class Plus</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
