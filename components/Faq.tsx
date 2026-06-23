'use client';

import { useState } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { FAQS } from '@/lib/data/content';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#062426] py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          theme="dark"
          eyebrow="FAQ"
          title={
            <>
              Questions? <span className="text-primary">We have answers</span>
            </>
          }
          description="Everything you need to know before booking your free demo class. Still curious? Talk to us on WhatsApp anytime."
        />

        <div className="mx-auto mt-12 max-w-3xl lg:mt-16">
          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={faq.question} delay={i * 50}>
                  <div
                    className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                      isOpen
                        ? 'border-primary-200 shadow-soft'
                        : 'border-black/8'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left lg:px-6 lg:py-5"
                      aria-expanded={isOpen}
                      aria-controls={`faq-content-${i}`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                            isOpen
                              ? 'bg-primary text-white'
                              : 'bg-bg-soft text-primary'
                          }`}
                        >
                          <HelpCircle className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-ink sm:text-base">
                          {faq.question}
                        </span>
                      </span>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? 'rotate-45 bg-secondary text-white'
                            : 'bg-bg-soft text-ink-muted'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>

                    {/* Content */}
                    <div
                      id={`faq-content-${i}`}
                      className={`grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pl-[3.75rem] text-sm leading-relaxed text-ink-muted lg:px-6 lg:pb-6">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Still have questions */}
          <Reveal className="mt-8 text-center" delay={200}>
            <p className="text-sm text-primary-200">
              Still have questions?{' '}
              <a
                href="#contact"
                className="font-semibold text-secondary hover:underline hover:text-secondary-400"
              >
                Contact our team →
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
