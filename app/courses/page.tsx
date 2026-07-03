import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import CoursesList from '@/components/CoursesList';
import {
  CheckCircle,
  Clock,
  BarChart3,
  ArrowRight,
  BookOpen,
  Play,
  Users,
  Download,
  Video,
  MessageCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'English Courses — TESCA Spoken English | Beginner to Advanced',
  description:
    'Explore TESCA\'s complete range of English courses — Spoken English Basic, Advanced, IELTS preparation, PTE, and Interview Prep. Live classes, flexible schedules, expert trainers.',
};

const FEATURES = [
  { icon: Video, label: 'Live Interactive Classes' },
  { icon: Play, label: 'Recorded Video Lessons' },
  { icon: Download, label: 'Study Materials' },
  { icon: Users, label: 'Peer Practice Groups' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
  { icon: BookOpen, label: 'Mock Tests & Quizzes' },
];

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Intermediate: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Advanced: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Professional: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-40 pb-20 lg:pt-48 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-16 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          <div className="container-x relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  All Courses
                </span>
                <h1 className="font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  Find Your Perfect
                  <br />
                  <span className="gradient-text">English Course</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
                  From complete beginners to IELTS aspirants — we have a course designed
                  exactly for your level, goal, and schedule.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
                  {FEATURES.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-center gap-2 rounded-full bg-white border border-black/8 px-4 py-2 text-xs font-medium text-ink-soft shadow-soft"
                    >
                      <f.icon className="h-4 w-4 text-primary" />
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Generated Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px] lg:max-w-none aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-soft-lg">
                  <img
                    src="/courses_hero.png"
                    alt="TESCA Courses Illustration"
                    className="w-full h-full object-contain"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Course Cards ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center max-w-5xl mx-auto">
              <CoursesList />
            </div>
          </div>
        </section>

        {/* ── What's included ── */}
        <section className="bg-[#062426] py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                Every Course Includes
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
                Built for Real Results
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Video,
                  title: 'Live Interactive Classes',
                  desc: 'Real-time sessions with expert trainers. Ask questions, get instant feedback, and practice speaking every day.',
                  color: 'bg-primary-50',
                  iconColor: 'text-primary',
                },
                {
                  icon: Play,
                  title: 'Recorded Lessons',
                  desc: 'Missed a class? No problem. All sessions are recorded and available in your dashboard for lifetime access.',
                  color: 'bg-secondary-50',
                  iconColor: 'text-secondary',
                },
                {
                  icon: Download,
                  title: 'Study Materials',
                  desc: 'Downloadable PDFs, vocabulary lists, grammar guides, and practice exercises curated by our expert team.',
                  color: 'bg-green-50',
                  iconColor: 'text-green-600',
                },
                {
                  icon: BookOpen,
                  title: 'Mock Tests & Quizzes',
                  desc: 'Regular assessments that track your progress. IELTS & PTE courses include 15+ full mock tests.',
                  color: 'bg-purple-50',
                  iconColor: 'text-purple-600',
                },
                {
                  icon: Users,
                  title: 'Peer Practice Groups',
                  desc: 'Join WhatsApp groups and weekend practice sessions with fellow students for real conversation practice.',
                  color: 'bg-blue-50',
                  iconColor: 'text-blue-600',
                },
                {
                  icon: MessageCircle,
                  title: 'Trainer Support',
                  desc: 'Direct access to your trainer via WhatsApp. Get questions answered within 24 hours — guaranteed.',
                  color: 'bg-orange-50',
                  iconColor: 'text-orange-600',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl bg-white/5 border border-white/10 p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-primary-100/80 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 to-primary-700 px-8 py-16 text-center">
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-primary-400/20 blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                  Not Sure Which Course Is Right for You?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-primary-200">
                  Take our free English level assessment and we&apos;ll recommend the perfect
                  course for your current level and goals.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/?demo=true" className="btn-warm">
                    Book Free Counselling
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
                    View Pricing Plans
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
