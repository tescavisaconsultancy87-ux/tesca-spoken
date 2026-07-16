import {
  GraduationCap,
  RadioTower,
  CalendarClock,
  Globe,
  Briefcase,
  Infinity as InfinityIcon,
  type LucideIcon,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { WHY_TESCA } from '@/lib/data/content';

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  RadiatingCircle: RadioTower,
  CalendarClock,
  Globe,
  Briefcase,
  Infinity: InfinityIcon,
};

const CARD_THEMES = [
  {
    bg: 'from-teal-50/50 via-white to-teal-50/20 group-hover:from-teal-50 group-hover:to-teal-100/30',
    border: 'border-teal-100/70 hover:border-teal-300/80',
    hoverShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(6,119,121,0.15)]',
    dotColor: '#067779',
    glow: 'from-teal-100 to-emerald-100',
    iconBg: 'bg-teal-50/80 text-teal-700 group-hover:bg-primary group-hover:text-white',
    numColor: 'text-teal-600/[0.06] group-hover:text-teal-600/15',
    actionColor: 'text-teal-600 group-hover:text-primary',
  },
  {
    bg: 'from-amber-50/50 via-white to-amber-50/20 group-hover:from-amber-50 group-hover:to-amber-100/30',
    border: 'border-amber-100/70 hover:border-amber-300/80',
    hoverShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(217,119,6,0.15)]',
    dotColor: '#d97706',
    glow: 'from-amber-100 to-orange-100',
    iconBg: 'bg-amber-50/80 text-amber-700 group-hover:bg-secondary group-hover:text-white',
    numColor: 'text-amber-600/[0.06] group-hover:text-amber-600/15',
    actionColor: 'text-amber-600 group-hover:text-secondary',
  },
  {
    bg: 'from-blue-50/50 via-white to-blue-50/20 group-hover:from-blue-50 group-hover:to-blue-100/30',
    border: 'border-blue-100/70 hover:border-blue-300/80',
    hoverShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)]',
    dotColor: '#2563eb',
    glow: 'from-blue-100 to-indigo-100',
    iconBg: 'bg-blue-50/80 text-blue-700 group-hover:bg-blue-600 group-hover:text-white',
    numColor: 'text-blue-600/[0.06] group-hover:text-blue-600/15',
    actionColor: 'text-blue-600 group-hover:text-blue-700',
  },
  {
    bg: 'from-emerald-50/50 via-white to-emerald-50/20 group-hover:from-emerald-50 group-hover:to-emerald-100/30',
    border: 'border-emerald-100/70 hover:border-emerald-300/80',
    hoverShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.15)]',
    dotColor: '#059669',
    glow: 'from-emerald-100 to-teal-100',
    iconBg: 'bg-emerald-50/80 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
    numColor: 'text-emerald-600/[0.06] group-hover:text-emerald-600/15',
    actionColor: 'text-emerald-600 group-hover:text-emerald-700',
  },
  {
    bg: 'from-violet-50/50 via-white to-violet-50/20 group-hover:from-violet-50 group-hover:to-violet-100/30',
    border: 'border-violet-100/70 hover:border-violet-300/80',
    hoverShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.15)]',
    dotColor: '#7c3aed',
    glow: 'from-violet-100 to-fuchsia-100',
    iconBg: 'bg-violet-50/80 text-violet-700 group-hover:bg-violet-600 group-hover:text-white',
    numColor: 'text-violet-600/[0.06] group-hover:text-violet-600/15',
    actionColor: 'text-violet-600 group-hover:text-violet-700',
  },
  {
    bg: 'from-rose-50/50 via-white to-rose-50/20 group-hover:from-rose-50 group-hover:to-rose-100/30',
    border: 'border-rose-100/70 hover:border-rose-300/80',
    hoverShadow: 'hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.15)]',
    dotColor: '#e11d48',
    glow: 'from-rose-100 to-pink-100',
    iconBg: 'bg-rose-50/80 text-rose-700 group-hover:bg-rose-600 group-hover:text-white',
    numColor: 'text-rose-600/[0.06] group-hover:text-rose-600/15',
    actionColor: 'text-rose-600 group-hover:text-rose-700',
  },
];

export default function WhyTesca() {
  return (
    <section id="why-tesca" className="bg-white py-14 lg:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why TESCA"
          title={
            <>
              Built for serious learners who want{' '}
              <span className="text-primary">real results</span>
            </>
          }
          description="For two decades, we have refined an approach that blends expert coaching, live practice, and career-focused curriculum — not just theory."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {WHY_TESCA.map((feat, i) => {
            const Icon = ICONS[feat.icon] ?? GraduationCap;
            const theme = CARD_THEMES[i % CARD_THEMES.length];
            return (
              <Reveal key={feat.title} delay={i * 80}>
                <article className={`group relative h-full overflow-hidden rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.bg} p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${theme.hoverShadow}`}>
                  {/* Subtle decorative dot pattern */}
                  <div 
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.05] pointer-events-none" 
                    style={{ 
                      backgroundImage: `radial-gradient(${theme.dotColor} 1.5px, transparent 1.5px)`, 
                      backgroundSize: '16px 16px' 
                    }} 
                  />

                  {/* Dynamic glow blur backdrops */}
                  <div className={`pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br ${theme.glow} opacity-0 blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-100`} />

                  {/* Watermark numbers */}
                  <div className={`absolute right-6 top-5 select-none font-heading text-6xl font-black transition-colors duration-300 ${theme.numColor}`}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Icon Container */}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${theme.iconBg} shadow-xs`}>
                        <Icon className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      {/* Content */}
                      <h3 className="mt-6 font-heading text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-slate-900">
                        {feat.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-500 transition-colors duration-300 group-hover:text-slate-600">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
