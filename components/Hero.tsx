'use client';

import { useEffect, useState, useRef, memo, ComponentType } from 'react';
import { CalendarCheck, Users, GraduationCap, TrendingUp, ShieldCheck, Phone, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';
import { useToast } from '@/context/ToastContext';
import { useCounter } from '@/hooks/useCounter';
import { useReveal } from '@/hooks/useReveal';
import { useTracking } from '@/hooks/useTracking';

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

const Hero = memo(function Hero() {
  const { openModal } = useDemoModal();
  const { toast } = useToast();
  const { getLeadEnrichment, trackEvent } = useTracking();
  const [quickPhone, setQuickPhone] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = quickPhone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.', 'Invalid Phone Number');
      return;
    }
    setQuickLoading(true);
    const enrichment = getLeadEnrichment();
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'demo',
          name: 'Website Call Request',
          phone: cleaned,
          email: '',
          course: 'General Spoken English',
          timeSlot: 'Flexible',
          learningMode: 'Online — Zoom / Meet',
          ...enrichment,
        }),
      });
      if (res.ok) {
        trackEvent('lead_form_submit', { formType: 'hero_quick_call' });
        toast.success('Our counselor will call you back in a while.', 'Request Received! 🎉', 6000);
        setQuickPhone('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to submit call request.', 'Submission Failed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.', 'Error');
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <>
      <section
        id="home"
        data-lcp-bg="true"
        className="relative min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-center items-center hero-bg text-slate-800 overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-40 lg:pb-36"
      >
        {/* Dark overlay for mobile to ensure crystal clear text contrast over background image */}
        <div className="absolute inset-0 bg-slate-950/70 z-0 lg:hidden pointer-events-none" />

        {/* Background decorative glow blobs */}
        <div className="hidden lg:block absolute top-1/4 left-[-10%] w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none lg:w-96 lg:h-96" />
        <div className="hidden lg:block absolute bottom-1/4 right-[-10%] w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none lg:w-[480px] lg:h-[480px]" />

        <div className="container-x relative z-10 w-full flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">
            
            {/* Left Column: Typography & CTA */}
            <div className="lg:col-span-6 xl:col-span-5 max-w-md sm:max-w-lg lg:max-w-xl space-y-4 text-center lg:text-left mx-auto lg:mx-0 order-1 lg:order-1 z-10 flex flex-col items-center lg:items-start">

              {/* Eyebrow Tag */}
              <div className="inline-flex pt-1 justify-center lg:justify-start w-full">
                <span className="inline-block text-[10px] sm:text-xs font-extrabold tracking-wider uppercase bg-white border border-slate-200/90 px-4 py-2 rounded-xl text-[#0b3336] shadow-md">
                  SINCE 2005 — 20+ YEARS OF EDUCATIONAL EXCELLENCE
                </span>
              </div>

              {/* Heading */}
              <h1 data-lcp="true" className="font-heading text-3xl sm:text-4xl lg:text-[44px] xl:text-[52px] font-extrabold leading-[1.15] lg:leading-[1.2] tracking-tight text-white lg:text-slate-900 drop-shadow-sm">
                Speak English <br className="hidden sm:inline" />
                Confidently{' '}
                <span className="relative inline-block text-secondary lg:text-[#f97316] drop-shadow-md">
                  Today.
                  {/* Custom hand-drawn SVG wave underline */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-secondary lg:text-[#f97316] pointer-events-none select-none"
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
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-slate-100 lg:text-slate-600 font-medium text-center lg:text-left drop-shadow-xs">
                Master fluent communication, ace international exams (IELTS/PTE), and accelerate your career. Learn 1-on-1 from Cambridge-certified trainers with interactive live practice.
              </p>

              {/* Quick 1-Field Call Back Form & CTA */}
              <div className="pt-2 space-y-3 w-full max-w-md">
                <form onSubmit={handleQuickSubmit} className="flex flex-col gap-3 w-full">
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      value={quickPhone}
                      onChange={(e) => setQuickPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit Mobile Number"
                      aria-label="Mobile Number"
                      className="w-full rounded-2xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 pl-11 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={quickLoading}
                    className="w-full rounded-2xl bg-[#199395] hover:bg-[#158082] text-white font-bold text-base py-3.5 shadow-md transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {quickLoading ? 'Submitting...' : 'Request Call Back'}
                    <PhoneCall className="h-4 w-4" />
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-1.5 gap-y-1 text-xs font-semibold text-slate-200 lg:text-slate-700 pt-1">
                  <span>Instant callback within 15 mins. Or</span>
                  <button
                    type="button"
                    onClick={openModal}
                    className="font-bold text-secondary lg:text-[#f97316] hover:underline cursor-pointer flex items-center gap-1 drop-shadow-xs"
                  >
                    Book Free Live Demo Class →
                  </button>
                </div>
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
});

export default Hero;

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