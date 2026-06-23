'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { CheckCircle, X, ArrowRight, Clock, Star, Zap } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for beginners',
    price: 7999,
    originalPrice: 11999,
    duration: '3 Months',
    features: [
      { text: 'Spoken English Basic Course', included: true },
      { text: '3 Live sessions per week', included: true },
      { text: 'Recorded lesson access', included: true },
      { text: 'Study materials PDF', included: true },
      { text: 'WhatsApp group access', included: true },
      { text: 'Monthly progress report', included: true },
      { text: 'IELTS / PTE preparation', included: false },
      { text: 'Mock tests (15+)', included: false },
      { text: 'Interview coaching', included: false },
      { text: 'Trainer one-on-one sessions', included: false },
    ],
    color: 'primary',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Most popular choice',
    price: 12999,
    originalPrice: 17999,
    duration: '4 Months',
    features: [
      { text: 'Spoken English Advanced Course', included: true },
      { text: '5 Live sessions per week', included: true },
      { text: 'Lifetime recorded access', included: true },
      { text: 'Complete study kit + PDFs', included: true },
      { text: 'Priority WhatsApp support', included: true },
      { text: 'Weekly + monthly reports', included: true },
      { text: '5 Mock tests included', included: true },
      { text: 'Peer practice groups', included: true },
      { text: 'Interview coaching module', included: false },
      { text: 'Trainer one-on-one sessions', included: false },
    ],
    color: 'secondary',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Maximum transformation',
    price: 22999,
    originalPrice: 32999,
    duration: '6 Months',
    features: [
      { text: 'All courses (Basic + Advanced)', included: true },
      { text: 'Daily live sessions', included: true },
      { text: 'Lifetime access to all content', included: true },
      { text: 'Full study kit + premium resources', included: true },
      { text: '24/7 trainer WhatsApp support', included: true },
      { text: 'Comprehensive progress tracking', included: true },
      { text: 'IELTS/PTE prep included', included: true },
      { text: '15+ full mock tests', included: true },
      { text: 'Interview coaching (5 sessions)', included: true },
      { text: '4 Trainer one-on-one sessions', included: true },
    ],
    color: 'ink',
    popular: false,
  },
];

const ADD_ONS = [
  { name: 'IELTS Intensive (6 Weeks)', price: '₹9,999', description: 'All 4 modules + 15 mock tests' },
  { name: 'PTE Mastery (5 Weeks)', price: '₹8,999', description: 'AI-scored mocks + templates' },
  { name: 'Interview Prep (4 Weeks)', price: '₹5,999', description: 'Mock interviews + HR coaching' },
  { name: 'One-on-One Coaching (10 hrs)', price: '₹4,999', description: 'Personalized training sessions' },
];

function CountdownTimer() {
  const getTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {[
        { value: pad(time.hours), label: 'Hrs' },
        { value: pad(time.minutes), label: 'Min' },
        { value: pad(time.seconds), label: 'Sec' },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="font-heading text-xl font-bold text-white tabular-nums">
              {unit.value}
            </span>
            <span className="text-[10px] text-primary-200 uppercase tracking-wide">{unit.label}</span>
          </div>
          {i < 2 && <span className="text-xl font-bold text-primary-300 mb-3">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const { openModal } = useDemoModal();
  const [billing, setBilling] = useState<'monthly' | 'full'>('full');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-40 pb-20 lg:pt-48 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-secondary/5 blur-3xl" />
          </div>

          <div className="container-x relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  Transparent Pricing
                </span>
                <h1 className="font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  Simple, Honest Pricing
                  <br />
                  <span className="gradient-text">No Hidden Fees</span>
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                  Choose the plan that fits your goals. All plans include a 7-day money-back
                  guarantee and a free demo class before you commit.
                </p>

                {/* Billing toggle */}
                <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-bg-soft p-1">
                  <button
                    onClick={() => setBilling('monthly')}
                    className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                      billing === 'monthly'
                        ? 'bg-primary text-white shadow-soft'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Monthly EMI
                  </button>
                  <button
                    onClick={() => setBilling('full')}
                    className={`rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                      billing === 'full'
                        ? 'bg-primary text-white shadow-soft'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    Full Payment
                    <span className="ml-2 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold text-secondary">
                      Save 10%
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: AI Generated Image */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px] lg:max-w-none aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-soft-lg">
                  <img
                    src="/pricing_hero.jpg"
                    alt="TESCA Pricing Illustration"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Cards ── */}
        <section className="pb-20 lg:pb-28">
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-3 items-stretch">
              {PLANS.map((plan) => {
                const displayPrice =
                  billing === 'monthly'
                    ? Math.ceil(plan.price / (plan.duration === '3 Months' ? 3 : plan.duration === '4 Months' ? 4 : 6))
                    : plan.price;
                const savings = Math.round(
                  ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
                );

                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col h-full overflow-hidden rounded-3xl border shadow-soft transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 ${
                      plan.popular
                        ? 'border-secondary/40 ring-2 ring-secondary/20'
                        : 'border-black/6 bg-white'
                    }`}
                  >
                    {plan.popular && (
                      <div className="bg-secondary py-2 text-center">
                        <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-white uppercase tracking-wide">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div
                      className={`p-8 ${
                        plan.popular
                          ? 'bg-gradient-to-br from-secondary-50 to-orange-50'
                          : plan.color === 'ink'
                          ? 'bg-gradient-to-br from-primary-900 to-primary-800'
                          : 'bg-white'
                      }`}
                    >
                      <h2
                        className={`font-heading text-2xl font-bold ${
                          plan.color === 'ink' ? 'text-white' : 'text-ink'
                        }`}
                      >
                        {plan.name}
                      </h2>
                      <p
                        className={`text-sm mt-1 ${
                          plan.color === 'ink' ? 'text-primary-200' : 'text-ink-muted'
                        }`}
                      >
                        {plan.tagline}
                      </p>

                      <div className="mt-6">
                        <div className="flex items-end gap-2">
                          <span
                            className={`font-heading text-4xl font-bold ${
                              plan.color === 'ink' ? 'text-white' : 'text-ink'
                            }`}
                          >
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                          {billing === 'monthly' && (
                            <span
                              className={`text-sm mb-1 ${
                                plan.color === 'ink' ? 'text-primary-200' : 'text-ink-muted'
                              }`}
                            >
                              /month
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`text-sm line-through ${
                              plan.color === 'ink' ? 'text-primary-300' : 'text-ink-muted'
                            }`}
                          >
                            ₹{plan.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                            Save {savings}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-3">
                          <Clock
                            className={`h-3.5 w-3.5 ${
                              plan.color === 'ink' ? 'text-primary-300' : 'text-ink-muted'
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              plan.color === 'ink' ? 'text-primary-200' : 'text-ink-muted'
                            }`}
                          >
                            {plan.duration} program
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className={`flex-1 p-8 ${plan.color === 'ink' ? 'bg-primary-900' : 'bg-white'}`}>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature.text} className="flex items-start gap-3">
                            {feature.included ? (
                              <CheckCircle
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                  plan.color === 'ink' ? 'text-secondary' : 'text-primary'
                                }`}
                              />
                            ) : (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-black/20" />
                            )}
                            <span
                              className={`text-sm ${
                                feature.included
                                  ? plan.color === 'ink'
                                    ? 'text-primary-100'
                                    : 'text-ink-soft'
                                  : plan.color === 'ink'
                                  ? 'text-primary-400 line-through'
                                  : 'text-ink-muted line-through'
                              }`}
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div
                      className={`mt-auto p-8 pt-0 ${plan.color === 'ink' ? 'bg-primary-900' : 'bg-white'}`}
                    >
                      <button
                        onClick={openModal}
                        className={`block w-full text-center cursor-pointer ${
                          plan.popular
                            ? 'btn-warm'
                            : plan.color === 'ink'
                            ? 'btn-secondary border-white/20 text-white hover:bg-white hover:text-primary'
                            : 'btn-primary'
                        }`}
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <p
                        className={`mt-3 text-center text-xs ${
                          plan.color === 'ink' ? 'text-primary-300' : 'text-ink-muted'
                        }`}
                      >
                        7-day money-back guarantee
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Add-ons ── */}
        <section className="bg-[#062426] py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                Optional Add-ons
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
                Customize Your Learning
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-primary-100/85">
                Add specialized courses to any plan. Mix and match to build your perfect
                English learning path.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ADD_ONS.map((addon) => (
                <div
                  key={addon.name}
                  className="group rounded-2xl bg-white/5 border border-white/10 p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <h3 className="font-heading text-base font-bold text-white">{addon.name}</h3>
                  <p className="mt-2 text-sm text-primary-100/80">{addon.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold font-heading text-secondary">{addon.price}</span>
                    <button
                      onClick={openModal}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 cursor-pointer"
                    >
                      Add
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ style guarantees ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Our Guarantees
                </span>
                <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                  Risk-Free Learning
                </h2>
                <p className="mt-4 text-ink-muted leading-relaxed">
                  We&apos;re so confident in our teaching quality that we offer ironclad guarantees.
                  Your success is our success.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: '7-Day Money Back',
                    desc: 'Not satisfied within the first week? Full refund. No questions, no hassle.',
                  },
                  {
                    title: 'Free Demo Class',
                    desc: 'Experience our teaching style before paying anything. Book a free 45-min class.',
                  },
                  {
                    title: 'Score Improvement Guarantee',
                    desc: 'IELTS & PTE students who follow the program get extended coaching at no extra cost.',
                  },
                  {
                    title: 'Lifetime Access to Materials',
                    desc: 'All study materials, PDFs, and recorded lessons are yours forever.',
                  },
                ].map((g) => (
                  <div
                    key={g.title}
                    className="flex gap-4 rounded-2xl border border-black/5 bg-bg-soft p-5"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-heading text-sm font-bold text-ink">{g.title}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 lg:py-28 bg-bg-soft">
          <div className="container-x">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 to-primary-700 px-8 py-16 text-center">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-secondary/20 blur-3xl" />
                <div className="absolute -bottom-10 left-1/4 h-40 w-40 rounded-full bg-primary-400/20 blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                  Start with a Free Demo Class
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-primary-200">
                  Experience TESCA&apos;s teaching quality for free. Book your demo class today
                  and meet your trainer before enrolling.
                </p>
                <button onClick={openModal} className="btn-warm mt-8 inline-flex cursor-pointer">
                  Book Free Demo Class
                  <ArrowRight className="h-4 w-4" />
                </button>
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