'use client';

import { TrendingUp, Quote } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { SUCCESS_METRICS, TRANSFORMATIONS } from '@/lib/data/content';
import { useCounter } from '@/hooks/useCounter';
import { useReveal } from '@/hooks/useReveal';

function Metric({
  value,
  label,
  suffix,
  active,
}: {
  value: number;
  label: string;
  suffix: string;
  active: boolean;
}) {
  const count = useCounter(value, active);
  return (
    <div className="text-center">
      <div className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
        {count.toLocaleString()}
        <span className="text-secondary">{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-medium text-primary-200 sm:text-base">
        {label}
      </div>
    </div>
  );
}

export default function StudentSuccess() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section id="success" className="bg-[#062426] py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          theme="dark"
          eyebrow="Success Stories"
          title={
            <>
              Real students, <span className="text-primary">real results</span>
            </>
          }
          description="Numbers do not lie. Here is what two decades of dedicated English coaching looks like."
        />

        {/* Animated metrics */}
        <div
          ref={ref}
          className="relative mt-12 overflow-hidden rounded-4xl bg-gradient-to-br from-primary-700 via-primary to-primary-800 p-8 shadow-soft-xl lg:mt-16 lg:p-14 border border-white/10"
        >
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
            {SUCCESS_METRICS.map((m) => (
              <Metric
                key={m.label}
                value={m.value}
                label={m.label}
                suffix={m.suffix}
                active={visible}
              />
            ))}
          </div>
        </div>

        {/* Before / After transformations */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
          {TRANSFORMATIONS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div className="group relative overflow-hidden rounded-3xl border border-black/5 bg-bg-soft shadow-soft transition-all duration-500 hover:shadow-soft-lg">
                {/* Quote accent */}
                <Quote className="absolute right-5 top-5 h-10 w-10 text-primary-100" />

                {/* Badge */}
                <div className="px-6 pt-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1 text-xs font-bold text-secondary">
                    <TrendingUp className="h-3 w-3" />
                    {t.band}
                  </span>
                </div>

                {/* Before / After grid */}
                <div className="grid gap-3 p-6 sm:grid-cols-2 sm:gap-4">
                  <div className="rounded-2xl border border-accent-100 bg-accent-50/40 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-accent">
                      Before TESCA
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {t.before}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-primary">
                      After TESCA
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {t.after}
                    </p>
                  </div>
                </div>

                {/* Student info */}
                <div className="flex items-center gap-3 border-t border-black/5 bg-white px-6 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-600 font-heading text-sm font-bold text-white">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.course}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
