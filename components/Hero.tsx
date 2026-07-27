'use client';

import { useEffect, useState, useRef, memo, ComponentType } from 'react';
import { CalendarCheck, Users, GraduationCap, TrendingUp, ShieldCheck, Phone, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';
import { useCounter } from '@/hooks/useCounter';
import { useReveal } from '@/hooks/useReveal';

const STATS_DATA = [
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

export default function Hero() {
  const { openModal } = useDemoModal();
  const [quickPhone, setQuickPhone] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);
  const [quickError, setQuickError] = useState('');

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError('');
    const cleaned = quickPhone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setQuickError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setQuickLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'demo',
          name: 'Website Call Request',
          phone: cleaned,
          email: `${cleaned}@phone.tesca.co`,
          course: 'General Spoken English',
          timeSlot: 'Flexible',
          learningMode: 'Online — Zoom / Meet',
        }),
      });
      if (res.ok) {
        setQuickSuccess(true);
        setQuickPhone('');
      } else {
        const data = await res.json();
        setQuickError(data.error || 'Failed to submit call request.');
      }
    } catch (err) {
      setQuickError('Something went wrong. Please try again.');
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-center items-center hero-bg text-slate-800 overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-40 lg:pb-36"
      >
        {/* Dark overlay for mobile to ensure text readability */}
        <div className="absolute inset-0 bg-slate-950/75 z-0 lg:hidden" />

        {/* Background decorative glow blobs */}
        <div className="absolute top-1/4 left-[-10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none lg:w-96 lg:h-96" />
        <div className="absolute bottom-1/4 right-[-10%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none lg:w-[480px] lg:h-[480px]" />

        <div className="container-x relative z-10 w-full flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            
            {/* Left Column: Typography & CTA */}
            <div className="lg:col-span-6 xl:col-span-5 max-w-md sm:max-w-lg lg:max-w-xl space-y-2 text-left order-1 lg:order-1 z-10">
              
              {/* Eyebrow Tag */}
              <div className="inline-flex">
                <span className="inline-block text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 bg-black/40 border border-white/15 px-3.5 py-1 rounded-full text-white/90 backdrop-blur-xs lg:bg-transparent lg:border-0 lg:p-0 lg:rounded-none lg:text-primary lg:backdrop-blur-none">
                  Cambridge-Certified English Training
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] xl:text-[52px] font-extrabold leading-[1.15] lg:leading-[1.2] tracking-tight text-white lg:text-slate-900">
                Speak English Confidently <br className="hidden sm:inline" />
                <span className="relative inline-block text-secondary lg:text-primary whitespace-nowrap">
                  Today.
                  {/* Custom hand-drawn SVG wave underline */}
                  <svg
                    className="absolute -bottom-2.5 left-0 w-full h-3 text-secondary lg:text-primary pointer-events-none select-none"
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
              <p className="max-w-xl text-base leading-relaxed text-slate-200 lg:text-slate-600 sm:text-lg">
                Master fluent communication, ace international exams (IELTS/PTE), and accelerate your career. Learn 1-on-1 from expert trainers with interactive live practice.
              </p>

              {/* Quick 1-Field Call Back Form & CTA */}
              <div className="pt-3 space-y-3">
                <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 max-w-lg">
                  <div className="relative flex-grow">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit Mobile Number"
                      className="w-full rounded-xl border border-white/20 bg-white text-slate-800 placeholder:text-slate-400 pl-10 pr-4 py-3.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={quickLoading}
                    className="rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs px-6 py-3.5 shadow-soft transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {quickLoading ? 'Submitting...' : 'Request Call Back'}
                    <PhoneCall className="h-4 w-4" />
                  </button>
                </form>

                {quickError && (
                  <p className="text-xs font-semibold text-red-400 bg-red-950/40 border border-red-500/30 rounded-xl p-2.5 max-w-lg">
                    {quickError}
                  </p>
                )}

                {quickSuccess ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 max-w-lg">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Request received! Our counselor will call you back in a while.</span>
                  </div>
                ) : (
                  <p className="text-[11px] font-medium text-slate-300 lg:text-slate-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span>Our team will call you back in a while. Or</span>
                    <button
                      type="button"
                      onClick={openModal}
                      className="font-bold text-secondary lg:text-primary hover:underline cursor-pointer ml-0.5"
                    >
                      Book Free Demo Class →
                    </button>
                  </p>
                )}
              </div>

            </div>

            {/* Right Column: Spacer on Desktop, Image on Mobile */}
            <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 order-2 lg:order-2 w-full justify-center items-center">
              {/* Desktop Spacer: background graphic shown via CSS background */}
              <div className="h-[550px] pointer-events-none" />
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
      <StatsBar stats={STATS_DATA} />
    </>
  );
}

/* ─── CountUp number component ─── */
function CountUp({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
  const { ref, visible } = useReveal<HTMLSpanElement>({ threshold: 0.3 });
  const count = useCounter(end, visible, duration);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Stats bar section ─── */
const StatsBar = memo(function StatsBar({ stats }: { stats: { value: string; label: string; icon: ComponentType<{ className?: string }>; numericEnd: number; suffix: string; prefix?: string }[] }) {
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
});