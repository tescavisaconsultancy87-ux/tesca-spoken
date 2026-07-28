'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { useDemoModal } from '@/context/DemoModalContext';
import { db } from '@/lib/db';
import { COURSES, COURSE_FAQS } from '@/lib/data/content';
import {
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Users,
  Video,
  Award,
  ChevronDown,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

interface CourseItem {
  id?: string;
  title: string;
  duration?: string;
  accent?: string;
  benefits?: string[];
  price?: string;
  originalPrice?: string;
  whoShouldJoin?: string;
  curriculum?: { module: string; topics: string[] }[];
  teachingMethod?: string;
  popular?: boolean;
}

export default function CourseDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id || '';
  const { openModal } = useDemoModal();

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState<number>(0);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const decodedParam = decodeURIComponent(rawId).toLowerCase();
        
        // 1. Check static COURSES data first
        const staticMatch = COURSES.find(
          (c) =>
            slugify(c.title) === decodedParam ||
            c.title.toLowerCase() === decodedParam
        );

        if (staticMatch) {
          setCourse(staticMatch);
          setLoading(false);
          return;
        }

        // 2. Fetch from DB
        const dbCourses = await db.getCourses();
        const dbMatch = dbCourses.find(
          (c: any) =>
            c.id === rawId ||
            slugify(c.title || '') === decodedParam ||
            (c.title && c.title.toLowerCase() === decodedParam)
        );

        if (dbMatch) {
          const benefits = Array.isArray(dbMatch.benefits)
            ? dbMatch.benefits
            : typeof dbMatch.benefits === 'string'
            ? dbMatch.benefits.split(',').map((b: string) => b.trim())
            : ['Live Interactive Practice', 'Expert Cambridge Trainers', 'Flexible Timings'];

          setCourse({
            id: dbMatch.id,
            title: dbMatch.title,
            duration: dbMatch.duration || '3 Months',
            accent: dbMatch.accent || 'primary',
            benefits: benefits,
            price: dbMatch.price ? (dbMatch.price.toString().startsWith('₹') ? dbMatch.price : `₹${dbMatch.price}`) : '₹7,999',
            originalPrice: dbMatch.original_price ? (dbMatch.original_price.toString().startsWith('₹') ? dbMatch.original_price : `₹${dbMatch.original_price}`) : '₹11,999',
            whoShouldJoin: 'Students, job seekers, and working professionals looking to speak English fluently and confidently.',
            curriculum: [
              { module: 'Module 1: Foundations', topics: ['Phonics & Pronunciation', 'Grammar Essentials', 'Daily Conversations'] },
              { module: 'Module 2: Fluency & Vocabulary', topics: ['500+ Active Words', 'Sentence Structuring', 'Public Speaking Practice'] },
              { module: 'Module 3: Mastery', topics: ['Interview Drills', 'Group Discussions', 'Accent Neutralization'] },
            ],
            teachingMethod: 'Live interactive classes with daily speaking practice, instant feedback, and small batch sizes (8-12 students).',
            popular: dbMatch.popular || false,
          });
        } else {
          setCourse(null);
        }
      } catch (err) {
        console.error('Failed to load course detail:', err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    if (rawId) {
      fetchCourse();
    }
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-32 pb-20">
          <div className="text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm font-semibold text-slate-500">Loading course details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Breadcrumb & Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 pt-36 pb-20 lg:pt-44 lg:pb-28 text-white">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
          </div>

          <div className="container-x relative z-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-300 hover:text-white transition-colors mb-6"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to All Courses
            </Link>

            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  {course.popular && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-bold text-amber-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most Popular
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1 text-xs font-medium text-slate-200">
                    <Clock className="h-3.5 w-3.5 text-primary-300" />
                    {course.duration || '3 Months'}
                  </span>
                </div>

                <h1 className="font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-tight text-white">
                  {course.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  {course.whoShouldJoin}
                </p>

                {/* Key highlights checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {(course.benefits || []).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-sm font-medium text-slate-200">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={openModal}
                    className="btn-warm px-6 py-3.5 text-sm font-bold shadow-lg cursor-pointer"
                  >
                    Book Free Live Demo
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link
                    href="/contact"
                    className="px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-sm font-semibold text-white transition-all"
                  >
                    Inquire Fee Structure
                  </Link>
                </div>
              </div>

              {/* Pricing Card Sidebar */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-8 shadow-2xl space-y-6">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Total Program Investment</span>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-4xl font-extrabold text-white">{course.price}</span>
                      {course.originalPrice && (
                        <span className="text-lg text-slate-400 line-through font-semibold">{course.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 pt-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      100% Satisfaction & Certificate Included
                    </span>
                  </div>

                  <hr className="border-white/10" />

                  <div className="space-y-3 text-xs text-slate-300 font-medium">
                    <div className="flex items-center justify-between">
                      <span>Batch Size:</span>
                      <span className="font-bold text-white">Small (8–12 Students)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mode:</span>
                      <span className="font-bold text-white">Live Online / Classroom</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Schedule:</span>
                      <span className="font-bold text-white">Morning & Evening Batches</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support:</span>
                      <span className="font-bold text-white">24/7 Trainer Q&A</span>
                    </div>
                  </div>

                  <button
                    onClick={openModal}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Enroll / Join Demo Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Curriculum & Topics */}
        {course.curriculum && course.curriculum.length > 0 && (
          <section className="py-20 lg:py-28 bg-slate-50">
            <div className="container-x max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  Syllabus Breakdown
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
                  What You Will Master
                </h2>
                <p className="text-slate-600 text-sm max-w-lg mx-auto">
                  Step-by-step structured curriculum designed by Cambridge-certified English language experts.
                </p>
              </div>

              <div className="space-y-4">
                {course.curriculum.map((mod, idx) => {
                  const isOpen = activeModule === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-soft transition-all"
                    >
                      <button
                        onClick={() => setActiveModule(isOpen ? -1 : idx)}
                        className="w-full flex items-center justify-between p-5 text-left font-heading text-base font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-xs font-extrabold text-primary">
                            {idx + 1}
                          </span>
                          {mod.module}
                        </span>
                        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {mod.topics.map((topic, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Teaching Methodology & Guarantee */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="container-x max-w-5xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary-900 via-slate-900 to-primary-950 p-8 sm:p-12 text-white shadow-2xl grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-200">
                  <GraduationCap className="h-4 w-4" />
                  Teaching Methodology
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold">
                  How You Learn With Us
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {course.teachingMethod}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Video, label: 'Live Speaking Drills' },
                  { icon: Users, label: 'Small Practice Batches' },
                  { icon: BookOpen, label: 'Curated Study Materials' },
                  { icon: Award, label: 'Course Certification' },
                ].map((item, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center space-y-2">
                    <item.icon className="h-6 w-6 text-primary-300 mx-auto" />
                    <span className="block text-xs font-bold text-white">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container-x max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-heading text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">Everything you need to know about enrollment and classes</p>
            </div>

            <div className="space-y-3">
              {COURSE_FAQS.map((faq, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-800 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
