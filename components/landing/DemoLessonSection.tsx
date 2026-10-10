'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, CheckCircle2, ArrowRight, Sparkles, Clock, BookOpen } from 'lucide-react';
import { metaTracking } from '@/lib/metaPixel';

export default function DemoLessonSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayToggle = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      metaTracking.demoPlay('Sample Lesson: Ordering Coffee & Daily Small Talk');
    }
  };

  return (
    <section id="demo-lesson" className="py-20 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-50 text-[#F97823] border border-orange-200 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Class Plus Interactive Preview
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            See What Learning Looks Like
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Experience our bite-sized, practical lesson format. Designed to make you speak immediately, not get lost in confusing theory.
          </p>
        </div>

        {/* Mock Demo Lesson Player & Transcript Box */}
        <div className="mt-12 max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Video Player Screen (7 cols) */}
            <div className="lg:col-span-7 bg-[#0b3336] text-white relative flex flex-col justify-between p-6 sm:p-8 min-h-[340px] sm:min-h-[400px]">
              {/* Top Bar inside player */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-teal-100">Lesson 04 Preview</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-bold text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>12 mins</span>
                </div>
              </div>

              {/* Center Play Button & Dynamic Waveform */}
              <div className="my-auto flex flex-col items-center justify-center text-center z-10 py-6">
                <button
                  type="button"
                  onClick={handlePlayToggle}
                  className="relative group focus:outline-none cursor-pointer"
                  aria-label={isPlaying ? 'Pause Demo Lesson' : 'Play Demo Lesson'}
                >
                  <span className="absolute -inset-3 rounded-full bg-orange-500/25 animate-ping group-hover:bg-orange-500/40" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#F97823] to-[#e45f0e] text-white flex items-center justify-center shadow-xl shadow-orange-500/40 group-hover:scale-105 transition-transform">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 fill-white" />
                    ) : (
                      <Play className="w-8 h-8 fill-white ml-1" />
                    )}
                  </div>
                </button>

                <p className="mt-4 font-heading font-extrabold text-lg sm:text-xl text-white">
                  Real-Life Dialogue: Ordering & Small Talk
                </p>
                <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-md">
                  {isPlaying
                    ? 'Playing sample audio snippet... practice speaking aloud with the audio!'
                    : 'Click play to listen to a 30-second live lesson drill.'}
                </p>

                {/* Animated Waveform when playing */}
                {isPlaying && (
                  <div className="mt-4 flex items-center justify-center gap-1.5 h-8">
                    {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 30, 75, 50].map((h, i) => (
                      <span
                        key={i}
                        className="w-1.5 bg-[#F97823] rounded-full animate-pulse"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${(i * 0.1).toFixed(1)}s`,
                          animationDuration: '0.8s',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-between text-xs text-teal-200/90 pt-3 border-t border-teal-800/80 z-10">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-teal-300" />
                  Audio & Video Lesson
                </span>
                <span className="text-amber-300 font-bold">Class Plus Mobile Course</span>
              </div>
            </div>

            {/* Right: Transcript & Key Takeaways (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200">
              <div>
                <span className="text-xs font-extrabold text-[#067779] uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Lesson Breakdown
                </span>
                <h4 className="font-heading font-bold text-lg text-slate-900 mt-1.5 mb-4">
                  Dialogue Transcript Snippet
                </h4>

                {/* Dialog snippet */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
                  <div>
                    <span className="text-[#067779] font-bold">Trainer (TESCA): </span>
                    <span className="text-slate-700 font-medium">
                      &quot;Good morning! What can I get started for you today?&quot;
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold">Learner Response: </span>
                    <span className="text-slate-900 font-bold">
                      &quot;I&apos;d like a regular cappuccino with less sugar, please. Can I get that to go?&quot;
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-[#F97823] font-bold">
                    💡 <strong>Speaking Tip:</strong> Use &quot;I&apos;d like...&quot; instead of direct &quot;I want...&quot; to sound natural and polite.
                  </div>
                </div>

                {/* Key Learning Points */}
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    What You Learn In This Lesson:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Natural sentence starters that prevent pauses</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Everyday polite conversational formulas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Correct intonation for questions & requests</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Conversion Trigger */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <a
                  href="#pricing"
                  onClick={() => metaTracking.ctaClick('demo-section', 'TRY THE COURSE')}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>TRY THE COURSE</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
