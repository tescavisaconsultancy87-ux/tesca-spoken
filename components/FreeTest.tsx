import { Clock, Award, Sparkles, ArrowRight, ListChecks } from 'lucide-react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';

const TEST_PERKS = [
  { icon: Clock, label: 'Takes only 5 minutes' },
  { icon: ListChecks, label: '30 smart questions' },
  { icon: Award, label: 'Instant detailed report' },
  { icon: Sparkles, label: '100% free, no signup' },
];

export default function FreeTest() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-600 to-primary-800 p-8 shadow-soft-xl lg:p-16">
            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/20 blur-3xl animate-blob-pulse" />
              <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-blob-pulse [animation-delay:5s]" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
                  backgroundSize: '32px 32px',
                }}
              />
              {/* Large ghost text */}
              <span className="absolute right-8 top-1/2 hidden -translate-y-1/2 font-heading text-[12rem] font-extrabold text-white/[0.04] lg:block">
                A1
              </span>
            </div>

            <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left: content */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free Assessment
                </span>

                <h2 className="mt-5 font-heading text-3xl font-bold leading-tight text-white text-balance sm:text-4xl lg:text-5xl">
                  Test Your English Level for{' '}
                  <span className="relative whitespace-nowrap">
                    <span className="relative z-10 text-secondary-200">Free</span>
                    <span className="absolute bottom-1 left-0 h-3 w-full bg-secondary/40 -skew-x-6" />
                  </span>
                </h2>

                <p className="mt-4 max-w-md text-base leading-relaxed text-primary-100">
                  Discover your CEFR level (A1–C2) in speaking, writing,
                  listening, and reading. Get a personalized improvement roadmap
                  instantly.
                </p>

                <div className="mt-8">
                  <Link href="/assessment" className="btn-warm">
                    Start Free Assessment
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right: perks grid */}
              <div className="grid grid-cols-2 gap-4">
                {TEST_PERKS.map((perk, i) => (
                  <div
                    key={perk.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/15"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                      <perk.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {perk.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
