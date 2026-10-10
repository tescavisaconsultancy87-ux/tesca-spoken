'use client';

import { Download, CheckCircle, Sparkles, Play } from 'lucide-react';
import { LANDING_CONFIG } from '@/lib/data/spokenEnglishLanding';
import { metaTracking } from '@/lib/metaPixel';

export default function AppShowcaseSection() {
  const handleAppDownload = (platform: 'playstore' | 'appstore' | 'classplus_web') => {
    metaTracking.appDownloadClick(platform);
  };

  return (
    <section id="app" className="py-20 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & App Store CTA buttons */}
          <div className="lg:col-span-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-[#067779] border border-teal-200 mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              AVAILABLE ON CLASS PLUS
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
              Your English Course. <br />
              <span className="text-[#067779]">
                Right in Your Pocket.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Access your lessons conveniently through the Class Plus app and learn wherever you are.
              Replay recorded speaking drills, review daily notes, and track your module completion smoothly.
            </p>

            {/* In-App Feature Highlights */}
            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#067779] border border-teal-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Instant offline download mode for uninterrupted practice on the go
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F97823] border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Bite-sized 10-15 minute modules structured around busy everyday routines
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  High-definition audio & video optimized for clear Indian accents
                </span>
              </div>
            </div>

            {/* App Store / Google Play Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={LANDING_CONFIG.playStoreLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAppDownload('playstore')}
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
              >
                <Download className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Get it on</p>
                  <p className="text-xs font-black">Google Play Store</p>
                </div>
              </a>

              <a
                href={LANDING_CONFIG.appStoreLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAppDownload('appstore')}
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all hover:scale-[1.02] shadow-md"
              >
                <Download className="w-5 h-5 text-sky-400" />
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Download on</p>
                  <p className="text-xs font-black">Apple App Store</p>
                </div>
              </a>
            </div>

            {/* Main Conversion CTA */}
            <div className="mt-6">
              <a
                href="#pricing"
                onClick={() => metaTracking.ctaClick('app-showcase', 'DOWNLOAD & START LEARNING')}
                className="inline-flex items-center gap-2 text-sm font-black text-[#F97823] hover:text-[#e45f0e] transition-colors"
              >
                <span>DOWNLOAD & START LEARNING →</span>
              </a>
            </div>
          </div>

          {/* Right Column: Triple App Screen Mockup Display */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="w-full max-w-md relative grid grid-cols-2 gap-4">
              {/* Screen 1: Course Dashboard */}
              <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-500">DASHBOARD</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="h-24 bg-gradient-to-br from-[#067779] to-[#04504f] text-white rounded-2xl p-3 flex flex-col justify-between shadow-xs">
                  <span className="text-[10px] font-bold text-teal-100">Current Course</span>
                  <span className="text-xs font-black text-white">Spoken English Pro</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-7 bg-slate-50 rounded-lg flex items-center px-2 text-[10px] text-slate-700 font-semibold border border-slate-100">
                    Lesson 01 • Complete ✓
                  </div>
                  <div className="h-7 bg-slate-50 rounded-lg flex items-center px-2 text-[10px] text-slate-700 font-semibold border border-slate-100">
                    Lesson 02 • Complete ✓
                  </div>
                  <div className="h-7 bg-teal-50 border border-teal-200 rounded-lg flex items-center px-2 text-[10px] text-[#067779] font-bold">
                    Lesson 03 • Next Up ▶
                  </div>
                </div>
              </div>

              {/* Screen 2: Progress & Speaking Drills */}
              <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 shadow-lg space-y-3 translate-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-500">SPEAKING DRILL</span>
                  <span className="text-[9px] font-bold text-[#F97823]">Class Plus</span>
                </div>
                <div className="h-24 bg-gradient-to-br from-amber-50 to-orange-100/70 border border-amber-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full bg-[#F97823] flex items-center justify-center text-white mb-1 shadow-md shadow-orange-500/25">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800">Fluency Roleplay</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-[10px] text-slate-700">
                  <p className="font-bold text-slate-900 mb-0.5">Speaking Accuracy</p>
                  <p className="text-emerald-600 font-black">92% Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
