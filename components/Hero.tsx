'use client';

import { useEffect, useState, useRef } from 'react';
import { CalendarCheck, Users, GraduationCap, TrendingUp, ShieldCheck } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';

export default function Hero() {
  const { openModal } = useDemoModal();

  const stats = [
    {
      value: '6000+',
      label: 'Expert Trainers',
      icon: GraduationCap,
      numericEnd: 6000,
      suffix: '+',
    },
    {
      value: '7M+',
      label: 'Successful Students',
      icon: Users,
      numericEnd: 7,
      suffix: 'L+',
    },
    {
      value: '98%',
      label: 'Success Rate',
      icon: TrendingUp,
      numericEnd: 95,
      suffix: '%',
    },
    {
      value: 'Since 2005',
      label: 'Years of Trust',
      icon: ShieldCheck,
      numericEnd: 2005,
      suffix: '',
      prefix: 'Since ',
    },
  ];

  return (
    <>
      <section
        id="home"
        className="relative min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-center items-center hero-bg text-slate-800 overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-40 lg:pb-36"
      >
        {/* Background decorative glow blobs */}
        <div className="absolute top-1/4 left-[-10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none lg:w-96 lg:h-96" />
        <div className="absolute bottom-1/4 right-[-10%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none lg:w-[480px] lg:h-[480px]" />

        <div className="container-x relative z-10 w-full flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            
            {/* Left Column: Typography & CTA */}
            <div className="lg:col-span-6 xl:col-span-5 max-w-md sm:max-w-lg lg:max-w-xl space-y-7 text-left order-1 lg:order-1 z-10">
              
              {/* Eyebrow Tag */}
              <span className="inline-block text-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-1">
                Cambridge-Certified English Training
              </span>

              {/* Heading */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] xl:text-[52px] font-extrabold leading-[1.15] lg:leading-[1.2] tracking-tight text-slate-900">
                Speak English Confidently. <br className="hidden sm:inline" />
                Shape Your{' '}
                <span className="relative inline-block text-primary whitespace-nowrap">
                  Global Future.
                  {/* Custom hand-drawn SVG wave underline */}
                  <svg
                    className="absolute -bottom-2.5 left-0 w-full h-3 text-primary pointer-events-none select-none"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3,7 Q50,2 97,5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subheadline / Description */}
              <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Master fluent communication, ace international exams (IELTS/PTE), and accelerate your career. Learn 1-on-1 from expert trainers with interactive live practice.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <button 
                  onClick={openModal} 
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-soft-lg active:translate-y-0 cursor-pointer"
                >
                  Book Free Demo Class
                </button>
              </div>

            </div>

            {/* Right Column: Spacer on Desktop, Image on Mobile */}
            <div className="lg:col-span-6 xl:col-span-7 order-2 lg:order-2 w-full flex justify-center items-center">
              {/* Desktop Spacer: background graphic shown via CSS background */}
              <div className="hidden lg:block h-[550px] pointer-events-none" />
              
              {/* Mobile/Tablet Graphic: Clean student graphic, hidden on desktop */}
              <div className="block lg:hidden w-full max-w-[320px] sm:max-w-[360px] mt-8 pointer-events-none select-none relative z-10 px-4">
                <div className="relative rounded-3xl overflow-hidden shadow-soft-lg border border-black/5 bg-white aspect-[1.1] w-full">
                  <img 
                    src="/hero-section-background.png" 
                    alt="TESCA Student" 
                    className="w-full h-full object-cover object-[95%_center]"
                    style={{ transform: 'scale(1.25)', transformOrigin: '95% 50%' }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Curve effect at the bottom transition */}
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
function StatsBar({ stats }: { stats: { value: string; label: string; icon: React.ComponentType<{ className?: string }>; numericEnd: number; suffix: string; prefix?: string }[] }) {
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
                  {stat.prefix || ''}<CountUp end={stat.numericEnd} suffix={stat.suffix} />
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