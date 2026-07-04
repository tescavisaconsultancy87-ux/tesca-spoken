'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import { COURSES } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';

interface ClientCourse {
  id: string;
  title: string;
  duration: string;
  accent: string;
  benefits: string[];
  whoShouldJoin?: string;
  popular?: boolean;
  price?: number;
  originalPrice?: number;
}

interface CoursesListProps {
  onEnroll?: (course: ClientCourse) => void;
}

export default function CoursesList({ onEnroll }: CoursesListProps) {
  const [courses, setCourses] = useState<ClientCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { openModal } = useDemoModal();

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getCourses();
        if (data && data.length > 0) {
          const mapped = data.map((c: any) => ({
            id: c.id,
            title: c.title,
            duration: c.duration || '3 Months',
            accent: c.accent || 'primary',
            benefits: c.benefits
              ? c.benefits.split(',').map((b: string) => b.trim())
              : ['Grammar foundations', 'Vocabulary building', 'Basic conversation'],
            whoShouldJoin: c.who_should_join || '',
            popular: !!c.popular,
            price: Number(c.price || 0),
            originalPrice: Number(c.original_price || c.price || 0),
          }));
          setCourses(mapped);
        } else {
          setCourses(
            COURSES.map((c) => ({
              id: c.title.toLowerCase().replace(/\s+/g, '-'),
              title: c.title,
              duration: c.duration,
              accent: c.accent,
              benefits: c.benefits,
              whoShouldJoin: c.whoShouldJoin || '',
              popular: c.popular,
              price: Number(c.price.replace(/[₹,]/g, '')),
              originalPrice: Number(c.originalPrice.replace(/[₹,]/g, '')),
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load courses from DB, using fallback', err);
        setCourses(
          COURSES.map((c) => ({
            id: c.title.toLowerCase().replace(/\s+/g, '-'),
            title: c.title,
            duration: c.duration,
            accent: c.accent,
            benefits: c.benefits,
            whoShouldJoin: c.whoShouldJoin || '',
            popular: c.popular,
            price: Number(c.price.replace(/[₹,]/g, '')),
            originalPrice: Number(c.originalPrice.replace(/[₹,]/g, '')),
          }))
        );
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
              <h2 className="font-heading text-xl font-bold text-ink leading-snug">
                {course.title}
              </h2>

              <div className="mt-3 flex items-center gap-4 text-sm text-ink-muted">
                <span className="flex items-center gap-1.5 rounded-full bg-white/80 border border-black/5 px-3 py-1 text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {course.duration}
                </span>
              </div>

              {course.whoShouldJoin && (
                <div className="mt-3 flex items-start gap-2 text-xs text-ink-muted leading-relaxed">
                  <Users className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                  <span>{course.whoShouldJoin}</span>
                </div>
              )}
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

            {/* CTA — Book Demo and Enroll Now */}
            <div className="border-t border-black/5 p-6 flex gap-2">
              <button
                onClick={openModal}
                className="flex-1 btn-secondary text-xs whitespace-nowrap cursor-pointer py-3 text-center rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Book Demo
              </button>
              {onEnroll && (
                <button
                  onClick={() => onEnroll(course)}
                  className={`flex-1 btn-warm text-xs whitespace-nowrap cursor-pointer font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1 ${
                    isPopular ? '' : 'btn-primary'
                  }`}
                  style={isPopular ? {} : { background: 'var(--color-primary)' }}
                >
                  Enroll Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
