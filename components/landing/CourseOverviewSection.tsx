'use client';

import { Clock, BookOpen, Layers, MonitorSmartphone, Smartphone, Globe, ShieldCheck } from 'lucide-react';
import { LANDING_CONFIG } from '@/lib/data/spokenEnglishLanding';

export default function CourseOverviewSection() {
  const specs = [
    {
      label: 'Course Duration',
      value: LANDING_CONFIG.courseDuration,
      icon: <Clock className="w-5 h-5 text-[#067779]" />,
      sub: 'Self-paced flexible schedule',
    },
    {
      label: 'Number of Lessons',
      value: LANDING_CONFIG.numberOfLessons,
      icon: <BookOpen className="w-5 h-5 text-[#F97823]" />,
      sub: 'Step-by-step modular lessons',
    },
    {
      label: 'Proficiency Level',
      value: LANDING_CONFIG.level,
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      sub: 'Zero English fear to confidence',
    },
    {
      label: 'Learning Format',
      value: LANDING_CONFIG.format,
      icon: <MonitorSmartphone className="w-5 h-5 text-sky-600" />,
      sub: 'Mobile phone & tablet ready',
    },
    {
      label: 'Learning Platform',
      value: LANDING_CONFIG.accessPlatform,
      icon: <Smartphone className="w-5 h-5 text-indigo-600" />,
      sub: 'Smooth video & audio streaming',
    },
    {
      label: 'Medium of Instruction',
      value: LANDING_CONFIG.language,
      icon: <Globe className="w-5 h-5 text-purple-600" />,
      sub: 'Easy bilingual explanations',
    },
    {
      label: 'Course Access Validity',
      value: LANDING_CONFIG.accessPeriod,
      icon: <ShieldCheck className="w-5 h-5 text-[#F97823]" />,
      sub: 'Replay lessons anytime',
    },
  ];

  return (
    <section id="course-overview" className="py-20 bg-slate-50 relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white border border-teal-200 text-[#067779] mb-3 shadow-xs">
            Course Specifications
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            Everything You Need to Start Speaking Better English
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            This course is designed to help you develop practical English speaking skills step by step.
            Instead of overwhelming you with complicated theory, you&apos;ll learn English through useful
            vocabulary, sentence structures, conversations and practical situations.
          </p>
        </div>

        {/* Specifications Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {specs.map((item, index) => (
            <div
              key={item.label}
              className={`bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-teal-300 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md ${
                index === specs.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">
                    {item.label}
                  </p>
                  <p className="text-base font-black text-slate-900 tracking-tight">
                    {item.value}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
