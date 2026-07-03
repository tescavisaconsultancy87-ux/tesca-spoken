import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { TRAINERS } from '@/lib/data/content';
import {
  GraduationCap,
  Users,
  Globe,
  Trophy,
  Heart,
  Lightbulb,
  Star,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TESCA Spoken English — Our Story, Mission & Expert Team',
  description:
    'Since 2005, TESCA has helped 5,000+ students master English fluency. Meet our Cambridge-certified trainers and learn about our mission to make quality English education accessible to all.',
};

const VALUES = [
  {
    icon: Heart,
    title: 'Student-First',
    description:
      'Every decision we make begins with one question: "Is this best for our students?" Our success is measured by your success.',
    color: 'bg-red-50 text-red-500',
  },
  {
    icon: Lightbulb,
    title: 'Innovation in Learning',
    description:
      'We blend proven pedagogy with modern tools — AI-based feedback, interactive tech, and gamified practice to keep learning engaging.',
    color: 'bg-yellow-50 text-yellow-500',
  },
  {
    icon: Globe,
    title: 'Global Standards',
    description:
      'Our curriculum is aligned with CEFR levels and international exam requirements, preparing you for a global stage.',
    color: 'bg-primary-50 text-primary',
  },
  {
    icon: Trophy,
    title: 'Excellence',
    description:
      'We maintain the highest standards of teaching quality. All our trainers are certified and continuously upskilled.',
    color: 'bg-secondary-50 text-secondary',
  },
];

const MILESTONES = [
  { year: '2005', event: 'TESCA Founded in Surat with a batch of 12 students' },
  { year: '2008', event: 'Launched IELTS preparation program — 100% pass rate in Year 1' },
  { year: '2012', event: 'Expanded to 3 cities; crossed 1,000 alumni milestone' },
  { year: '2016', event: 'Introduced live online classes — now available globally' },
  { year: '2019', event: 'Launched PTE and Interview Prep programs; 3,000 students trained' },
  { year: '2022', event: 'Partnership with 50+ corporates for employee English training' },
  { year: '2024', event: 'Over 5,000 students trained across 25+ countries' },
];

const STATS = [
  { value: '5,000+', label: 'Students Trained', icon: Users },
  { value: '20+', label: 'Expert Trainers', icon: GraduationCap },
  { value: '25+', label: 'Countries Reached', icon: Globe },
  { value: '95%', label: 'Success Rate', icon: Trophy },
];

const FACULTY_TEAM = [
  {
    name: 'Kiran Lathiya',
    badge: 'Founder',
    badgeStyle: 'bg-accent-950/40 text-accent-300 border-accent-800/30',
    title: 'CEO & Spoken English Guru',
    titleStyle: 'text-primary-400',
    description:
      '25+ years of transforming students into confident English speakers. Former corporate trainer at multinational companies. His "Zero to Hero" methodology has helped 10,000+ students overcome hesitation.',
    photo: '/kiran.png',
    tags: [
      { text: 'Accent Trainer', style: 'border-teal-500/20 bg-teal-500/5 text-teal-300' },
      { text: 'Corporate English', style: 'border-secondary-500/20 bg-secondary-500/5 text-secondary-300' },
    ],
  },
  {
    name: 'Nikunj Dhanani',
    badge: 'Co-Founder',
    badgeStyle: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/30',
    title: 'Lead Visa Consultant',
    titleStyle: 'text-primary-400',
    description:
      'With 12+ years in international education, Nikunj has successfully placed 5000+ students in top global universities. His expertise in visa documentation has achieved a remarkable 99.2% success rate.',
    photo: '/nikunj.png',
    tags: [
      { text: 'UK Visa Expert', style: 'border-blue-500/20 bg-blue-500/5 text-blue-300' },
      { text: 'Profile Builder', style: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300' },
    ],
  },
  {
    name: 'Vishal Faldu',
    badge: 'Head Mentor',
    badgeStyle: 'bg-blue-950/40 text-blue-300 border-blue-800/30',
    title: 'Spoken English Guru',
    titleStyle: 'text-secondary-400',
    description:
      'A British Council certified trainer with 8+ years experience. Specializes in helping students achieve Band 8+ in IELTS and 85+ in PTE. Known for his unique "Score Booster" techniques.',
    photo: '/vishal.png',
    tags: [
      { text: 'IELTS Band 9', style: 'border-purple-500/20 bg-purple-500/5 text-purple-300' },
      { text: 'PTE Expert', style: 'border-rose-500/20 bg-rose-500/5 text-rose-300' },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-40 pb-20 lg:pt-48 lg:pb-28">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          <div className="container-x relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  About TESCA
                </span>
                <h1 className="font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  Two Decades of
                  <br />
                  <span className="gradient-text">Transforming Lives</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
                  Since 2005, TESCA Spoken English has been on a single mission — to make every student
                  confident, fluent, and globally competitive in English communication.
                </p>

                {/* Stats bar */}
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center lg:items-start gap-1 rounded-2xl bg-white border border-black/8 p-4 shadow-soft"
                    >
                      <stat.icon className="h-5 w-5 text-primary mb-1 animate-pulse" />
                      <span className="font-heading text-xl font-bold text-ink lg:text-2xl">
                        {stat.value}
                      </span>
                      <span className="text-[10px] text-ink-muted leading-none">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Generated Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px] lg:max-w-none aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-soft-lg">
                  <img
                    src="/about_hero.png"
                    alt="TESCA About Us Illustration"
                    className="w-full h-full object-contain"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mission & Story ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Story text */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Our Story
                </span>
                <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                  Started by a dream,
                  <br />
                  fuelled by results
                </h2>
                <div className="mt-6 space-y-4 text-ink-muted leading-relaxed">
                  <p>
                    TESCA was born in a small room in Surat in 2005 with a simple belief:
                    <strong className="text-ink"> every student deserves world-class English education</strong>,
                    regardless of their background or location.
                  </p>
                  <p>
                    Our founder, Dr. Anjali Desai, had trained hundreds of students privately and
                    saw a consistent pattern — students were bright, motivated, and capable. What
                    they lacked was structured guidance, consistent practice, and a supportive
                    community.
                  </p>
                  <p>
                    Today, TESCA has trained over 5,000 students across 25+ countries, from students
                    aiming for IELTS Band 8.0+ to professionals seeking promotions and freshers
                    cracking Fortune 500 interviews.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="btn-warm mt-8 inline-flex"
                >
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Visual card */}
              <div className="relative">
                <div className="rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 p-8 lg:p-10">
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Our Mission</p>
                    <p className="text-2xl font-bold font-heading text-ink leading-snug">
                      &ldquo;To empower every student to communicate in English with confidence, clarity, and conviction — anywhere in the world.&rdquo;
                    </p>
                  </div>
                  <hr className="border-primary-200 my-6" />
                  <div>
                    <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Our Vision</p>
                    <p className="text-ink-muted leading-relaxed">
                      To be the most trusted English learning institution in South Asia and a
                      globally recognized name in language education by 2030.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
                      T
                    </div>
                    <div>
                      <p className="font-semibold text-ink">TESCA Spoken English</p>
                      <p className="text-sm text-ink-muted">Trusted since 2005</p>
                    </div>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 rounded-2xl bg-secondary px-5 py-3 text-white shadow-warm">
                  <p className="text-xs font-semibold">Overall Rating</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                    <span className="text-sm font-bold ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="bg-bg-soft py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                What We Stand For
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                Our Core Values
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-2xl bg-white border border-black/5 p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${value.color}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-ink mb-2">{value.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Our Journey
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                Two Decades of Impact
              </h2>
            </div>

            <div className="relative mx-auto max-w-3xl">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-100 lg:left-1/2" />

              {MILESTONES.map((milestone, i) => (
                <div
                  key={milestone.year}
                  className={`relative mb-8 flex gap-6 ${
                    i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 top-3 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-white shadow-soft lg:left-1/2" />

                  {/* Card */}
                  <div className={`ml-14 flex-1 lg:ml-0 ${i % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft">
                      <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary mb-2">
                        {milestone.year}
                      </span>
                      <p className="text-sm text-ink-muted leading-relaxed">{milestone.event}</p>
                    </div>
                  </div>

                  {/* Spacer for the other side on desktop */}
                  <div className="hidden flex-1 lg:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Faculty Team ── */}
        <section className="bg-[#011616] py-20 lg:py-28 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="container-x relative z-10">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-900/50 border border-primary-800/30 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-300">
                Meet Our Experts
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
                World-Class <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-secondary bg-clip-text text-transparent">Faculty Team</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-100/70">
                Learn from industry veterans with decades of combined experience in English training and global visa consultancy.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {FACULTY_TEAM.map((member) => (
                <div
                  key={member.name}
                  className="group relative rounded-3xl bg-[#022222]/60 border border-primary-800/30 hover:border-primary-400/50 p-6 flex flex-col justify-between items-center text-center shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center">
                    {/* Portrait Photo Container */}
                    <div className="relative w-28 h-28 mb-5 rounded-full overflow-hidden border-2 border-primary-800/60 group-hover:border-primary-400 transition-colors duration-300">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white">{member.name}</h3>

                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider mt-2.5 ${member.badgeStyle}`}>
                      {member.badge}
                    </span>

                    <p className={`text-xs font-semibold mt-3 ${member.titleStyle}`}>
                      {member.title}
                    </p>

                    <p className="text-xs text-primary-100/70 leading-relaxed mt-4 font-normal">
                      {member.description}
                    </p>
                  </div>

                  {/* Tags at the bottom */}
                  <div className="flex flex-wrap gap-2 justify-center mt-6 pt-5 border-t border-primary-900/50 w-full">
                    {member.tags.map((tag) => (
                      <span
                        key={tag.text}
                        className={`text-[9px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${tag.style}`}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trainers ── */}
        <section className="bg-bg-soft py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Meet The Team
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                World-Class Trainers
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-muted">
                Every TESCA trainer is certified, experienced, and passionate about helping you
                succeed. They don&apos;t just teach — they mentor.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRAINERS.map((trainer) => (
                <div
                  key={trainer.name}
                  className="group overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={trainer.photo}
                      alt={trainer.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
                        {trainer.students} students
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-base font-bold text-ink">{trainer.name}</h3>
                    <p className="text-sm text-primary font-medium mt-0.5">{trainer.role}</p>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        {trainer.certification}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        {trainer.experience} experience
                      </div>
                      <div className="flex items-center gap-2 text-xs text-ink-muted">
                        <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        {trainer.specialization}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="rounded-3xl bg-gradient-to-br from-primary-900 to-primary-700 px-8 py-16 text-center relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-primary-400/20 blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                  Ready to Begin Your English Journey?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-primary-200">
                  Join over 5,000 students who transformed their lives with TESCA. Book a free
                  demo class today — no commitment required.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/?demo=true" className="btn-warm">
                    Book Free Demo Class
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/courses" className="btn-secondary border-white text-white hover:bg-white hover:text-primary">
                    Explore Courses
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
