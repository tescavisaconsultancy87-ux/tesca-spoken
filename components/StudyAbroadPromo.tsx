'use client';

import { GraduationCap, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

export default function StudyAbroadPromo() {
  return (
    <section className="relative bg-bg-soft py-20 lg:py-24 overflow-hidden border-t border-b border-black/5">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-100/40 blur-3xl" />
        <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-secondary-100/40 blur-3xl" />
      </div>

      <div className="container-x relative z-10">
        <Reveal>
          <div className="rounded-[2.5rem] bg-gradient-to-br from-primary-950 to-indigo-950 p-8 shadow-2xl text-white md:p-14 lg:p-16 flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden border border-primary-800/30">
            {/* Decorative pattern/blur overlay */}
            <div className="absolute -right-48 -bottom-48 w-96 h-96 bg-primary-800/20 rounded-full blur-[80px] pointer-events-none" />

            {/* Left section: Text */}
            <div className="flex-1 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-800 bg-primary-900/60 px-4.5 py-2 text-xs font-bold uppercase tracking-wider text-primary-200">
                🌍 Global Opportunities
              </span>
              
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Dreaming of Studying <span className="text-primary-300">Abroad?</span>
              </h2>
              
              <p className="text-base text-primary-100 leading-relaxed max-w-2xl font-normal">
                Let TESCA Visa Consultancy make your international education dreams a reality. From university admissions to visa audits, our senior advisors support you at every step of your journey.
              </p>

              {/* Destinations list */}
              <div className="pt-2">
                <span className="block text-xs font-semibold text-primary-400 uppercase tracking-widest mb-3">Popular Destinations</span>
                <div className="flex flex-wrap gap-2.5">
                  {['USA', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Europe'].map((dest) => (
                    <span 
                      key={dest}
                      className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-primary-100"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="https://tescavisa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full sm:w-auto flex items-center justify-center gap-1.5 group cursor-pointer"
                >
                  Visit tescavisa.com
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <span className="text-xs font-medium text-primary-400">
                  97% Visa Success Rate • Free Profile Evaluation
                </span>
              </div>
            </div>

            {/* Right section: Trust signals list */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-xs">
                <h3 className="text-lg font-bold text-white font-heading">TESCA Visa Support</h3>
                
                <div className="space-y-4">
                  {[
                    { icon: GraduationCap, val: "800+ Universities", label: "Global partnerships & direct application channels" },
                    { icon: ShieldCheck, val: "Senior Audits", label: "Meticulous verification of visa & financial profiles" },
                    { icon: Globe, val: "30,000+ Placed", label: "Successful student placements since 2005" }
                  ].map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="p-2 bg-primary-900/60 text-primary-300 rounded-xl border border-primary-800">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5 text-left">
                          <h4 className="text-sm font-bold text-white leading-none">{item.val}</h4>
                          <p className="text-xs text-primary-200 leading-normal font-normal">{item.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/10 text-center text-xs font-semibold text-primary-300">
                  🎁 Exclusive waiver on visa processing for TESCA students!
                </div>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
