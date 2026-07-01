'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { CalendarCheck, BookOpen, Star, Users, Award, GraduationCap, TrendingUp, ShieldCheck } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';

export default function Hero() {
  const { openModal } = useDemoModal();

  const stats = [
    {
      value: '200+',
      label: 'Expert Trainers',
      icon: GraduationCap,
      numericEnd: 200,
      suffix: '+',
    },
    {
      value: '30K+',
      label: 'Successful Students',
      icon: Users,
      numericEnd: 30,
      suffix: 'K+',
    },
    {
      value: '95%',
      label: 'Success Rate',
      icon: TrendingUp,
      numericEnd: 95,
      suffix: '%',
    },
    {
      value: '10+',
      label: 'Years of Trust',
      icon: ShieldCheck,
      numericEnd: 10,
      suffix: '+',
    },
  ];

  return (
    <>
      <section
        id="home"
        className="relative min-h-[90vh] flex flex-col justify-center items-center bg-white text-slate-800 overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-24"
      >
        {/* Decorative large teal circular blob */}
        <div className="absolute top-1/4 right-[5%] w-[450px] h-[450px] rounded-full bg-primary-50/45 filter blur-3xl z-[1] pointer-events-none select-none" />

        {/* Decorative Dots Pattern */}
        <div className="absolute top-24 right-12 w-28 h-36 opacity-35 pointer-events-none select-none z-[15] hidden lg:block">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#F97823]" />
            ))}
          </div>
        </div>

        {/* Orange circle ring */}
        <div className="absolute top-[35%] right-[38%] w-4.5 h-4.5 rounded-full border-2 border-[#F97823] opacity-50 z-[15] hidden lg:block animate-pulse" />

        {/* Background illustration on the right */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[48%] xl:w-[44%] z-[5] pointer-events-none select-none flex items-end lg:items-center justify-end">
          <img
            src="/hero_image.png"
            alt="TESCA Students"
            className="w-full h-full object-contain object-bottom lg:object-right"
          />
          {/* Soft fade overlay on the left to blend with the text section */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-48 bg-gradient-to-r from-white via-white/80 to-transparent hidden lg:block" />
          {/* Bottom fade to remove hard edge */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/70 to-transparent hidden lg:block" />
          {/* Mobile fade overlay (bottom-up) */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-white via-white/95 to-transparent lg:hidden" />
        </div>

        <div className="container-x relative z-20 w-full flex-1 flex flex-col justify-center">
          {/* Content restricted to max-w-2xl so it stays on the left and does not layer over the students on the right */}
          <div className="max-w-2xl space-y-7 text-left">
            
            {/* Trust Tags */}
            <div className="flex flex-wrap items-center justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#FFF3EC] border border-[#FFE2D1] text-[#D95A14] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                <Award className="h-3.5 w-3.5 text-[#D95A14]" />
                Cambridge Certified Trainers
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#E6F7F7] border border-[#C5ECEE] text-[#067779] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                <Users className="h-3.5 w-3.5 text-[#067779]" />
                5000+ Students
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#FEF9E7] border border-[#FCEEC5] text-[#B7950B] text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                <Star className="h-3.5 w-3.5 text-[#B7950B] fill-current" />
                4.9/5 Student Rating
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-800 sm:text-5xl lg:text-[56px] text-balance">
              Speak English <br />
              <span className="gradient-text">Confidently.</span> <br />
              Transform Your Future.
            </h1>

            {/* Subheadline / Subtitle */}
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Unlock global career paths and test success (IELTS/PTE). Join thousands of professionals speaking with clarity, confidence, and authority under guidance from expert tutors.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start pt-2">
              <button 
                onClick={openModal} 
                className="btn-warm w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm transition-transform hover:scale-[1.03] cursor-pointer shadow-lg hover:shadow-warm flex items-center justify-center gap-2"
              >
                <CalendarCheck className="h-4.5 w-4.5" />
                Book Free Demo Class
              </button>
              <a 
                href="/courses" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 bg-white text-slate-800 font-bold text-sm hover:bg-slate-50 transition-all duration-300 hover:scale-[1.03]"
              >
                <BookOpen className="h-4.5 w-4.5 text-slate-600" />
                Explore Courses
              </a>
            </div>
          </div>
        </div>

        {/* Wave shape at the bottom */}
        <div className="absolute bottom-0 inset-x-0 z-20 pointer-events-none translate-y-[2px]">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0,80 C480,130 960,130 1440,50 L1440,120 L0,120 Z"
              fill="#F4FBFB"
            />
          </svg>
        </div>
      </section>

      {/* Stats Bar under Hero Section */}
      <StatsBar stats={stats} />
    </>
  );
}

/* ─── CountUp number component ─── */
function CountUp({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const stepDuration = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Stats bar section ─── */
function StatsBar({ stats }: { stats: { value: string; label: string; icon: React.ComponentType<{ className?: string }>; numericEnd: number; suffix: string }[] }) {
  return (
    <div className="relative z-30 bg-[#F4FBFB] border-y border-[#E6F3F3]/80 py-12 md:py-16">
      <div className="container-x">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center space-y-3.5">
                <div className="text-slate-600">
                  <Icon className="h-8 w-8 stroke-[1.5]" />
                </div>
                <span className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                  <CountUp end={stat.numericEnd} suffix={stat.suffix} />
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}