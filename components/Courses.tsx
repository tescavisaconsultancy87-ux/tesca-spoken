'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, BarChart3, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { COURSES } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';
import { db } from '@/lib/db';



export default function Courses() {
  const { openModal } = useDemoModal();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getCourses();
        if (data && data.length > 0) {
          const mapped = data.map((c: any) => {
            const priceVal = Number(c.price || 0);
            const origVal = Number(c.original_price || priceVal * 1.5);
            return {
              id: c.id,
              title: c.title,
              duration: c.duration || '3 Months',
              accent: c.accent || 'primary',
              benefits: c.benefits 
                ? c.benefits.split(',').map((b: string) => b.trim()) 
                : ['Grammar foundations', 'Vocabulary building', 'Basic conversation'],
              price: `₹${priceVal.toLocaleString('en-IN')}`,
              originalPrice: `₹${origVal.toLocaleString('en-IN')}`,
              popular: !!c.popular
            };
          });
          setCourses(mapped);
        } else {
          setCourses(COURSES);
        }
      } catch (err) {
        console.error('Failed to load courses on Home, using fallback', err);
        setCourses(COURSES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 max-w-5xl mx-auto justify-center">
          {loading ? (
            <div className="col-span-full py-12 text-center text-primary-200">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
              <p className="mt-2 text-xs font-semibold">Loading courses...</p>
            </div>
          ) : (
            courses.map((course, i) => {
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
                      {course.benefits.map((b: string) => (
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
                        {course.originalPrice && course.originalPrice !== course.price && (
                          <p className="text-xs text-ink-muted line-through">{course.originalPrice}</p>
                        )}
                      </div>
                      {(() => {
                        try {
                          const orig = parseInt((course.originalPrice || '').replace(/[₹,]/g, ''));
                          const price = parseInt((course.price || '').replace(/[₹,]/g, ''));
                          if (orig > 0 && orig > price) {
                            const pct = Math.round(((orig - price) / orig) * 100);
                            return (
                              <div className="rounded-lg bg-green-50 border border-green-200 px-2 py-1 text-center">
                                <p className="text-[10px] font-semibold text-green-700">
                                  Save {pct}%
                                </p>
                              </div>
                            );
                          }
                        } catch (e) {}
                        return null;
                      })()}
                    </div>
                    <div className="flex gap-2">
                      {(() => {
                        const planParam = course.id === 'spoken-english-basic' ? 'starter' :
                                          course.id === 'business-communication' ? 'professional' :
                                          course.id === 'vocabulary-accelerator' ? 'premium' :
                                          course.title.toLowerCase().includes('basic') ? 'starter' :
                                          course.title.toLowerCase().includes('business') || course.title.toLowerCase().includes('interview') ? 'professional' :
                                          course.title.toLowerCase().includes('vocabulary') || course.title.toLowerCase().includes('idioms') ? 'premium' : '';
                        const enrollHref = planParam ? `/pricing?plan=${planParam}` : '/pricing';
                        return (
                          <a
                            href={enrollHref}
                            className={`flex-1 btn-warm text-[11px] py-2 px-3 justify-center items-center flex cursor-pointer ${
                              isPopular ? '' : 'btn-primary'
                            }`}
                            style={isPopular ? {} : { background: 'var(--color-primary)' }}
                          >
                            Enroll
                            <ArrowRight className="h-3 w-3 shrink-0 ml-1" />
                          </a>
                        );
                      })()}
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
          }))}
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
