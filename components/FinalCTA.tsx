'use client';

import { CalendarCheck, MessageCircle, ShieldCheck, Clock, Users } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { WHATSAPP_URL } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';

const TRUST_SIGNALS = [
  { icon: ShieldCheck, label: 'Certified Trainers' },
  { icon: Clock, label: 'Free demo — no card required' },
  { icon: Users, label: 'Join 5000+ successful students' },
];

export default function FinalCTA() {
  const { openModal } = useDemoModal();
  return (
    <section id="book-demo" className="relative bg-white py-20 lg:py-28">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary-100 bg-white p-8 shadow-soft-xl lg:p-16">
            {/* Background accent */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary-50 blur-3xl" />
              <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary-50 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
              {/* Urgency badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                </span>
                Limited Seats This Month
              </span>

              <h2 className="mt-6 font-heading text-3xl font-bold leading-tight tracking-tight text-ink text-balance sm:text-4xl lg:text-5xl">
                Ready to Speak English with{' '}
                <span className="gradient-text">Confidence?</span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                Book your free demo class today and experience the TESCA
                difference. No payment, no commitment — just a transformative
                learning session.
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={openModal}
                  className="btn-primary w-full sm:w-auto cursor-pointer"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book Free Demo
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-warm w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-black/5 pt-8">
                {TRUST_SIGNALS.map((signal) => (
                  <div
                    key={signal.label}
                    className="flex items-center gap-2 text-sm font-medium text-ink-soft"
                  >
                    <signal.icon className="h-4 w-4 text-primary" />
                    {signal.label}
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
