'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, BarChart3, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import { COURSES } from '@/lib/data/content';



interface ClientCourse {
  id?: string;
  title: string;
  duration: string;
  accent: string;
  benefits: string[];
  price: string;
  originalPrice: string;
  popular?: boolean;
}

export default function CoursesList() {
  const [courses, setCourses] = useState<ClientCourse[]>([]);
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
        console.error('Failed to load courses from DB, using fallback', err);
        setCourses(COURSES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="col-span-full py-12 text-center text-ink-muted">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-2 text-xs font-semibold">Loading courses...</p>
      </div>
    );
  }

  return (
    <>
      {courses.map((course) => {
        const isPopular = course.popular;

        return (
          <div
            key={course.title}
            className={`group relative flex flex-col rounded-3xl border bg-white shadow-soft transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 overflow-hidden ${
              isPopular ? 'border-secondary/40 ring-2 ring-secondary/20 shadow-soft-lg' : 'border-black/6'
            }`}
          >
            {isPopular && (
              <div className="absolute top-0 right-0 rounded-bl-2xl rounded-tr-3xl bg-secondary px-4 py-1.5 text-xs font-bold text-white z-10">
                Most Popular
              </div>
            )}

            {/* Card header */}
            <div
              className={`p-6 pb-5 ${
                course.accent === 'secondary'
                  ? 'bg-gradient-to-br from-secondary-50 to-orange-50'
                  : course.accent === 'accent'
                  ? 'bg-gradient-to-br from-red-50 to-rose-50'
                  : 'bg-gradient-to-br from-primary-50 to-teal-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-xl font-bold text-ink leading-snug">
                  {course.title}
                </h2>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex-1 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-muted mb-3">
                What You&apos;ll Learn
              </p>
              <ul className="space-y-2.5">
                {course.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & CTA */}
            <div className="border-t border-black/5 p-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold font-heading text-ink">{course.price}</p>
                  {course.originalPrice && (
                    <p className="text-sm text-ink-muted line-through">{course.originalPrice}</p>
                  )}
                </div>
                {course.originalPrice && course.price && (
                  <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-center">
                    <p className="text-xs font-semibold text-green-700">
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
                )}
              </div>
              <div className="flex gap-3">
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
                      className={`flex-1 btn-warm text-sm ${
                        isPopular ? '' : 'btn-primary'
                      }`}
                      style={isPopular ? {} : { background: 'var(--color-primary)' }}
                    >
                      Enroll Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  );
                })()}
                <a
                  href="/?demo=true"
                  className="btn-secondary text-sm"
                >
                  Free Demo
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
