'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Play, CheckCircle2, Sparkles, Volume2, Star } from 'lucide-react';
import { TRUST_INDICATORS } from '@/lib/data/spokenEnglishLanding';
import { metaTracking } from '@/lib/metaPixel';
import gsap from 'gsap';

export default function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const trustGroupRef = useRef<HTMLDivElement>(null);
  const visualWrapperRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);
  const ratingBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: -16,
        duration: 0.6,
      })
        .from(
          headlineRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          '-=0.3'
        )
        .from(
          subheadlineRef.current,
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          descRef.current,
          {
            opacity: 0,
            y: 14,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          ctaGroupRef.current,
          {
            opacity: 0,
            y: 18,
            duration: 0.6,
          },
          '-=0.3'
        )
        .from(
          trustGroupRef.current,
          {
            opacity: 0,
            y: 14,
            duration: 0.6,
          },
          '-=0.3'
        )
        .from(
          visualWrapperRef.current,
          {
            opacity: 0,
            scale: 0.95,
            y: 25,
            duration: 0.9,
          },
          '-=0.7'
        );

      // Subtle float on floating journey card
      if (floatingCardRef.current) {
        gsap.to(floatingCardRef.current, {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Subtle pulse on rating badge
      if (ratingBadgeRef.current) {
        gsap.to(ratingBadgeRef.current, {
          y: 6,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.4,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCta = (label: string) => {
    metaTracking.ctaClick('hero', label);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#f0fafa] via-white to-slate-50 text-slate-900 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100"
    >
      {/* Background Soft Glow Accents matching TESCA palette */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#067779]/8 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#F97823]/8 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Copy & High-Converting CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left">
            {/* Eyebrow Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 self-start mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white border border-teal-200 text-[#067779] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#067779] animate-pulse" />
                ONLINE SPOKEN ENGLISH COURSE • CLASS PLUS
              </span>
            </div>

            {/* Main Headline */}
            <h1
              ref={headlineRef}
              className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-[52px] tracking-tight leading-[1.12] text-slate-900"
            >
              Speak English{' '}
              <span className="relative inline-block text-[#067779]">
                With Confidence.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#F97823] pointer-events-none select-none"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3,7 Q50,2 97,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="text-slate-800">Without Fear. Without Hesitation.</span>
            </h1>

            {/* Supporting Headline */}
            <p
              ref={subheadlineRef}
              className="mt-5 text-lg sm:text-xl font-bold text-slate-700 leading-snug"
            >
              Build the English speaking skills you need for real-life conversations, work, interviews and everyday communication.
            </p>

            {/* Short Paragraph */}
            <p
              ref={descRef}
              className="mt-3 text-base text-slate-600 max-w-2xl leading-relaxed"
            >
              Learn practical spoken English through structured lessons, real-life examples and regular practice — all from your phone.
            </p>

            {/* Dual CTAs */}
            <div
              ref={ctaGroupRef}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <a
                href="#pricing"
                onClick={() => handleCta('START LEARNING (Hero Primary)')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#F97823] to-[#e45f0e] hover:from-[#e45f0e] hover:to-[#d04e05] text-white font-extrabold text-base sm:text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-4 focus:ring-orange-400/40"
              >
                <span>START LEARNING</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#how-it-works"
                onClick={() => handleCta('SEE HOW IT WORKS (Hero Secondary)')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-white hover:bg-teal-50/60 border-2 border-[#067779] text-[#067779] font-bold text-base shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#067779]"
              >
                <Play className="w-4 h-4 fill-[#067779] text-[#067779]" />
                <span>SEE HOW IT WORKS</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div
              ref={trustGroupRef}
              className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-semibold text-slate-700"
            >
              {TRUST_INDICATORS.map((indicator) => (
                <div key={indicator} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{indicator}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Real Human Photography + Class Plus Mobile Mockup */}
          <div ref={visualWrapperRef} className="lg:col-span-5 relative flex justify-center items-center">
            {/* Soft decorative background frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-100/60 to-amber-100/40 rounded-3xl -z-10 blur-xl scale-95" />

            {/* Main Visual Composition Container */}
            <div className="relative w-full max-w-[420px] flex items-center justify-center py-2">
              {/* Real Student Photo */}
              <div className="relative z-10 w-full max-w-[320px] sm:max-w-[340px]">
                <Image
                  src="/new_hero_student.png"
                  alt="Confident English learner using mobile app"
                  width={420}
                  height={500}
                  priority
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Class Plus App Interactive Mini-Card (Overlaid on bottom right) */}
              <div className="absolute -bottom-4 right-0 sm:-right-4 z-20 w-64 sm:w-72 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-xl shadow-slate-900/10 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#067779] flex items-center justify-center text-[10px] font-black text-white">
                      CP
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold text-slate-900 leading-tight">Class Plus App</p>
                      <p className="text-[9px] font-medium text-slate-500">TESCA Spoken English</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Batch
                  </span>
                </div>

                {/* Progress Mini Bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-600 mb-1">
                    <span>Daily Fluency Practice</span>
                    <span className="text-[#F97823] font-bold">Level 2 of 6</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#067779] to-[#F97823] h-1.5 rounded-full w-[45%]" />
                  </div>
                </div>

                {/* Audio Drill Snippet */}
                <div className="mt-2.5 p-2 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#067779] text-white flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-800 truncate">Audio Repeat & Speak</p>
                    <p className="text-[9px] text-slate-500">Everyday Conversations</p>
                  </div>
                  <span className="text-[9px] font-bold text-[#067779]">Active</span>
                </div>
              </div>

              {/* Floating Card: "Your English Journey" (Overlaid on top left) */}
              <div
                ref={floatingCardRef}
                className="absolute top-4 -left-2 sm:-left-6 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3.5 shadow-lg shadow-slate-900/10 text-left max-w-[190px]"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-teal-100 text-[#067779] flex items-center justify-center">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900">Your English Journey</h4>
                </div>
                <ul className="space-y-0.5 text-[10px] font-semibold text-slate-700">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span> Vocabulary
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span> Grammar
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span> Speaking
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span> Confidence
                  </li>
                </ul>
              </div>

              {/* Rating Trust Badge (Floating upper right) */}
              <div
                ref={ratingBadgeRef}
                className="absolute top-2 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5"
              >
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="text-[11px] font-extrabold text-slate-800">4.9 / 5</span>
                <span className="text-[9px] font-semibold text-slate-500">(500+ Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
