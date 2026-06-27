'use client';

import { CalendarCheck, BookOpen, Star, Users, GraduationCap, Trophy, Target } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';

const HERO_FEATURES = [
  { icon: GraduationCap, label: 'Since 2005' },
  { icon: Users, label: '5000+ Trained' },
  { icon: Target, label: 'IELTS 8.0+' },
  { icon: Star, label: '4.9/5 Rating' },
];

export default function Hero() {
  const { openModal } = useDemoModal();

  return (
    <section
      id="home"
      className="relative overflow-x-clip pt-28 pb-6 lg:pt-36 lg:pb-10"
      style={{
        background: `
          radial-gradient(circle at 90% 10%, rgba(13, 148, 136, 0.08), transparent 45%),
          linear-gradient(135deg, #f8fbfc 0%, #eef7f8 50%, #ffffff 100%)
        `,
      }}
    >
      <div className="container-x relative z-20">
        <div className="grid items-center lg:items-start gap-10 lg:grid-cols-[45fr_55fr] lg:gap-12">
          {/* Left column */}
          <div className="animate-fade-up text-center lg:text-left">
            {/* Since 2005 badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 shadow-soft backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-primary">
                Trusted Since 2005 · 20 Years of Excellence
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-5 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl xl:text-6xl text-balance">
              Speak English{' '}
              <span className="relative whitespace-nowrap">
                <span className="gradient-text">Confidently.</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C50 3 150 3 298 7"
                    stroke="#F97823"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              Transform Your Future.
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg lg:mx-0">
              Join thousands of students and professionals who improved their
              communication skills through TESCA&apos;s expert-led programs.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
              <button onClick={openModal} className="btn-warm w-full sm:w-auto transition-transform hover:scale-[1.03] cursor-pointer">
                <CalendarCheck className="h-4 w-4" />
                Book Free Demo
              </button>
              <a href="/courses" className="btn-secondary w-full sm:w-auto transition-transform hover:scale-[1.03]">
                <BookOpen className="h-4 w-4" />
                Explore Courses
              </a>
            </div>

            {/* Hero feature pills */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-lg">
              {HERO_FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="group flex items-center gap-2 rounded-xl border border-black/5 bg-white/60 px-3 py-2 transition-all duration-300 hover:border-primary-200 hover:shadow-soft"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <f.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-ink-soft">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — trainer image with floating cards */}
          <div className="relative mt-12 lg:mt-0 flex flex-col lg:flex-row items-center lg:items-start lg:pt-6 justify-center h-full min-h-[340px] lg:min-h-[420px] animate-fade-in [animation-delay:300ms]">
            {/* Trainer Image Wrapper */}
            <div className="relative w-full max-w-[320px] sm:max-w-[340px] lg:max-w-[380px] mx-auto z-10 flex items-center justify-center">
              <img
                src="/tutor.png"
                alt="TESCA English Communication Trainer"
                className="w-full h-[320px] sm:h-[360px] lg:h-[400px] object-cover object-top block animate-float rounded-3xl"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))' }}
              />

              {/* Desktop Floating Cards (hidden on mobile, absolute on desktop) */}
              <div className="hidden lg:block">
                {/* Card 1: Top Right */}
                <div className="absolute top-[10%] -right-4 xl:-right-10 z-20 animate-float">
                  <div className="bg-white/85 backdrop-blur-[12px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-[12px_16px] border border-white/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2.5 w-[185px]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                      <Star className="h-4.5 w-4.5 fill-current" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">4.9 Rating</p>
                      <p className="text-[10px] text-ink-muted mt-0.5">1200+ Reviews</p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Middle Left */}
                <div className="absolute top-[38%] -left-8 xl:-left-12 z-20 animate-float [animation-delay:1.5s]">
                  <div className="bg-white/85 backdrop-blur-[12px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-[12px_16px] border border-white/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2.5 w-[185px]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                      <Target className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">IELTS 8.0+</p>
                      <p className="text-[10px] text-ink-muted mt-0.5">Average Success</p>
                    </div>
                  </div>
                </div>

                {/* Card 3: Bottom Right */}
                <div className="absolute bottom-[24%] -right-4 xl:-right-10 z-20 animate-float [animation-delay:3s]">
                  <div className="bg-white/85 backdrop-blur-[12px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-[12px_16px] border border-white/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2.5 w-[185px]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                      <Users className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">5000+</p>
                      <p className="text-[10px] text-ink-muted mt-0.5">Students Trained</p>
                    </div>
                  </div>
                </div>

                {/* Card 4: Bottom Left */}
                <div className="absolute bottom-[8%] -left-8 xl:-left-12 z-20 animate-float [animation-delay:4.5s]">
                  <div className="bg-white/85 backdrop-blur-[12px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-[12px_16px] border border-white/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2.5 w-[185px]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary">
                      <Trophy className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink">Since 2005</p>
                      <p className="text-[10px] text-ink-muted mt-0.5">Trusted Institute</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Trust Cards (shown below image on mobile, hidden on desktop) */}
            <div className="mt-8 grid grid-cols-2 gap-4 lg:hidden w-full max-w-[420px] mx-auto z-20">
              {/* Card 1 */}
              <div className="bg-white/85 backdrop-blur-[12px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-3 border border-white/50 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">4.9 Rating</p>
                  <p className="text-[10px] text-ink-muted">1200+ Reviews</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/85 backdrop-blur-[12px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-3 border border-white/50 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Target className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">IELTS 8.0+</p>
                  <p className="text-[10px] text-ink-muted">Avg Success</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/85 backdrop-blur-[12px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-3 border border-white/50 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">5000+</p>
                  <p className="text-[10px] text-ink-muted">Students</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white/85 backdrop-blur-[16px] rounded-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-3 border border-white/50 flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-50 text-secondary">
                  <Trophy className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink">Since 2005</p>
                  <p className="text-[10px] text-ink-muted">Trusted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" className="w-full" fill="none">
          <path
            d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 50C840 60 960 70 1080 65C1200 60 1320 40 1380 30L1440 20V80H0Z"
            fill="#F8F9FA"
          />
        </svg>
      </div>
    </section>
  );
}

