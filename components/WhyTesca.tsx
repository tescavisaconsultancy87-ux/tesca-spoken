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
            return (
              <Reveal key={feat.title} delay={i * 80}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-black/5 bg-white p-7 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-lg">
                  {/* Hover gradient backdrop */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-50 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    {/* Icon */}
                    <div className="relative inline-flex">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-white shadow-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-soft">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="mt-5 font-heading text-lg font-bold text-ink">
                      {feat.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                      {feat.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
