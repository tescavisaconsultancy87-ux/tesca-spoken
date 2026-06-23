'use client';

import { CheckCircle, Clock, BarChart3, ArrowRight, Star } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { COURSES } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Intermediate: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Advanced: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Professional: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

export default function Courses() {
  const { openModal } = useDemoModal();
  return (
    <section id="courses" className="bg-[#062426] py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          theme="dark"
          eyebrow="Courses"
          title={
            <>
              Programs designed for{' '}
              <span className="text-secondary">every level</span>
            </>
          }
          description="From absolute beginners to advanced exam takers — find the perfect course to match your goals and schedule."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-5">
          {COURSES.map((course, i) => {
            const levelStyle = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner;
            const isPopular = course.popular;

            return (
              <Reveal
                key={course.title}
                delay={i * 70}
                className={isPopular ? 'lg:-mt-4' : ''}
              >
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-soft transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 ${
                    isPopular
                      ? 'border-secondary/40 ring-2 ring-secondary/20 shadow-soft-lg'
                      : 'border-black/5'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 rounded-bl-2xl bg-secondary px-3 py-1 text-[10px] font-bold text-white z-10 uppercase tracking-wide">
                      Popular
                    </div>
                  )}

                  {/* Card header */}
                  <div
                    className={`p-5 pb-4 relative z-0 ${
                      course.accent === 'secondary'
                        ? 'bg-gradient-to-br from-secondary-50 to-orange-50'
                        : course.accent === 'accent'
                        ? 'bg-gradient-to-br from-red-50 to-rose-50'
                        : 'bg-gradient-to-br from-primary-50 to-teal-50'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="font-heading text-base font-bold text-ink leading-snug">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
                        >
                          {course.level}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-ink-muted">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="flex-1 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted mb-2.5">
                      What You&apos;ll Learn
                    </p>
                    <ul className="space-y-2">
                      {course.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-ink-soft">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & CTA */}
                  <div className="border-t border-black/5 p-5">
                    <div className="flex items-end justify-between mb-3.5">
                      <div>
                        <p className="text-xl font-bold font-heading text-ink">{course.price}</p>
                        <p className="text-xs text-ink-muted line-through">{course.originalPrice}</p>
                      </div>
                      <div className="rounded-lg bg-green-50 border border-green-200 px-2 py-1 text-center">
                        <p className="text-[10px] font-semibold text-green-700">
                          Save{' '}
                          {Math.round(
                            ((parseInt(course.originalPrice.replace(/[₹,]/g, '')) -
                              parseInt(course.price.replace(/[₹,]/g, ''))) /
                              parseInt(course.originalPrice.replace(/[₹,]/g, ''))) *
                              100
                          )}
                          %
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={openModal}
                        className={`flex-1 btn-warm text-[11px] py-2 px-3 justify-center cursor-pointer ${
                          isPopular ? '' : 'btn-primary'
                        }`}
                        style={isPopular ? {} : { background: 'var(--color-primary)' }}
                      >
                        Enroll
                        <ArrowRight className="h-3 w-3 shrink-0 ml-1" />
                      </button>
                      <button
                        onClick={openModal}
                        className="btn-secondary text-[11px] py-2 px-3 justify-center cursor-pointer"
                      >
                        Demo
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom note */}
        <Reveal className="mt-10 text-center" delay={200}>
          <p className="text-sm text-primary-200">
            All courses include live classes, recordings, study material, and
            lifetime alumni access.{' '}
            <button
              onClick={openModal}
              className="font-semibold text-secondary hover:underline cursor-pointer"
            >
              Not sure which course? Get free guidance →
            </button>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
