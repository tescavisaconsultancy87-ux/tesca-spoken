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
    bg: 'from-teal-50/60 to-teal-100/20 hover:to-teal-100/40',
    border: 'border-teal-100/50 hover:border-teal-300',
    dotColor: '#067779',
    glow: 'from-teal-200 to-emerald-200',
    iconBg: 'bg-teal-50 text-teal-700 group-hover:bg-gradient-to-br group-hover:from-teal-600 group-hover:to-teal-700 group-hover:text-white',
    iconGlow: 'bg-teal-200/50',
    accentLine: 'from-teal-500 to-emerald-500',
    numColor: 'text-teal-950/[0.03] group-hover:text-teal-500/[0.08]',
    titleColor: 'group-hover:text-teal-900',
    actionColor: 'text-teal-700/80',
  },
  {
    bg: 'from-amber-50/60 to-amber-100/20 hover:to-amber-100/40',
    border: 'border-amber-100/50 hover:border-amber-300',
    dotColor: '#d97706',
    glow: 'from-amber-200 to-orange-200',
    iconBg: 'bg-amber-50 text-amber-700 group-hover:bg-gradient-to-br group-hover:from-amber-600 group-hover:to-amber-700 group-hover:text-white',
    iconGlow: 'bg-amber-200/50',
    accentLine: 'from-amber-500 to-orange-500',
    numColor: 'text-amber-950/[0.03] group-hover:text-amber-500/[0.08]',
    titleColor: 'group-hover:text-amber-900',
    actionColor: 'text-amber-700/80',
  },
  {
    bg: 'from-blue-50/60 to-blue-100/20 hover:to-blue-100/40',
    border: 'border-blue-100/50 hover:border-blue-300',
    dotColor: '#2563eb',
    glow: 'from-blue-200 to-indigo-200',
    iconBg: 'bg-blue-50 text-blue-700 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white',
    iconGlow: 'bg-blue-200/50',
    accentLine: 'from-blue-500 to-indigo-500',
    numColor: 'text-blue-950/[0.03] group-hover:text-blue-500/[0.08]',
    titleColor: 'group-hover:text-blue-900',
    actionColor: 'text-blue-700/80',
  },
  {
    bg: 'from-emerald-50/60 to-emerald-100/20 hover:to-emerald-100/40',
    border: 'border-emerald-100/50 hover:border-emerald-300',
    dotColor: '#059669',
    glow: 'from-emerald-200 to-teal-200',
    iconBg: 'bg-emerald-50 text-emerald-700 group-hover:bg-gradient-to-br group-hover:from-emerald-600 group-hover:to-emerald-700 group-hover:text-white',
    iconGlow: 'bg-emerald-200/50',
    accentLine: 'from-emerald-500 to-teal-500',
    numColor: 'text-emerald-950/[0.03] group-hover:text-emerald-500/[0.08]',
    titleColor: 'group-hover:text-emerald-900',
    actionColor: 'text-emerald-700/80',
  },
  {
    bg: 'from-violet-50/60 to-violet-100/20 hover:to-violet-100/40',
    border: 'border-violet-100/50 hover:border-violet-300',
    dotColor: '#7c3aed',
    glow: 'from-violet-200 to-fuchsia-200',
    iconBg: 'bg-violet-50 text-violet-700 group-hover:bg-gradient-to-br group-hover:from-violet-600 group-hover:to-violet-700 group-hover:text-white',
    iconGlow: 'bg-violet-200/50',
    accentLine: 'from-violet-500 to-fuchsia-500',
    numColor: 'text-violet-950/[0.03] group-hover:text-violet-500/[0.08]',
    titleColor: 'group-hover:text-violet-900',
    actionColor: 'text-violet-700/80',
  },
  {
    bg: 'from-rose-50/60 to-rose-100/20 hover:to-rose-100/40',
    border: 'border-rose-100/50 hover:border-rose-300',
    dotColor: '#e11d48',
    glow: 'from-rose-200 to-pink-200',
    iconBg: 'bg-rose-50 text-rose-700 group-hover:bg-gradient-to-br group-hover:from-rose-600 group-hover:to-rose-700 group-hover:text-white',
    iconGlow: 'bg-rose-200/50',
    accentLine: 'from-rose-500 to-pink-500',
    numColor: 'text-rose-950/[0.03] group-hover:text-rose-500/[0.08]',
    titleColor: 'group-hover:text-rose-900',
    actionColor: 'text-rose-700/80',
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
                <article className={`group relative h-full overflow-hidden rounded-4xl border ${theme.border} bg-gradient-to-b ${theme.bg} p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-soft-xl`}>
                  {/* Subtle decorative dot pattern */}
                  <div 
                    className="absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.07] pointer-events-none" 
                    style={{ 
                      backgroundImage: `radial-gradient(${theme.dotColor} 1.5px, transparent 1.5px)`, 
                      backgroundSize: '20px 20px' 
                    }} 
                  />

                  {/* Dynamic glow blur backdrops */}
                  <div className={`pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br ${theme.glow} opacity-0 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-20`} />
                  <div className={`pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gradient-to-br ${theme.glow} opacity-0 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-10`} />

                  {/* Watermark numbers */}
                  <div className={`absolute right-6 top-4 select-none font-heading text-6xl font-black transition-colors duration-500 ${theme.numColor}`}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Icon Container */}
                      <div className="relative flex h-14 w-14 items-center justify-center">
                        {/* Glow ring behind icon */}
                        <div className={`absolute inset-0 rounded-2xl ${theme.iconGlow} opacity-0 blur-md transition-all duration-500 group-hover:scale-125 group-hover:opacity-100`} />
                        <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ${theme.iconBg} shadow-sm`}>
                          <Icon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className={`mt-6 font-heading text-xl font-bold text-ink transition-colors duration-300 ${theme.titleColor}`}>
                        {feat.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted transition-colors duration-300 group-hover:text-ink-soft">
                        {feat.description}
                      </p>
                    </div>

                    {/* Bottom action indicator */}
                    <div className={`mt-8 flex items-center gap-1.5 text-xs font-semibold ${theme.actionColor} opacity-0 translate-x-[-8px] transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0`}>
                      <span>Learn more</span>
                      <svg className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Left accent line */}
                  <span className={`absolute left-0 top-0 h-0 w-1.5 bg-gradient-to-b ${theme.accentLine} transition-all duration-500 group-hover:h-full`} />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
