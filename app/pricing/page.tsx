'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { CheckCircle, X, ArrowRight, Clock, Star, Zap } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';
import { db } from '@/lib/db';

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

function CountdownTimer({ expiryType, fixedExpiry }: { expiryType: string; fixedExpiry: string }) {
  const getTimeLeft = () => {
    const now = new Date();
    let end = new Date();
    if (expiryType === 'fixed' && fixedExpiry) {
      const parsedEnd = new Date(fixedExpiry);
      if (!isNaN(parsedEnd.getTime())) {
        end = parsedEnd;
      } else {
        end.setHours(23, 59, 59, 999);
      }
    } else {
      end.setHours(23, 59, 59, 999);
    }
    const diff = Math.max(0, end.getTime() - now.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, isExpired: diff <= 0 };
  };

  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryType, fixedExpiry]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (expiryType === 'fixed' && time.isExpired) {
    return (
      <span className="text-xs font-bold text-rose-300 uppercase tracking-widest py-2">
        Offer Expired
      </span>
    );
  }

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
  const [settings, setSettings] = useState({
    showOfferBanner: true,
    showTimer: true,
    timerExpiryType: 'rolling',
    timerFixedExpiry: '',
    showProgressBar: true,
    claimedPercentage: 85,
    progressBarText: '🔥 [percentage]% of promotional seats claimed',
  });

  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<any | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleGetStarted = (plan: any) => {
    setSelectedPlanForPurchase(plan);
    setCheckoutForm({ name: '', email: '', phone: '', city: '' });
    setPaymentSuccess(false);
    setPaymentError(null);
    setAgreedToTerms(false);
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setPaymentError('You must agree to the Terms of Service, Privacy Policy, and Refund Policy to proceed.');
      return;
    }
    setIsPurchasing(true);
    setPaymentError(null);

    try {
      // 1. Create order on the backend
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanForPurchase.id,
          billing: billing,
          email: checkoutForm.email
        }),
      });

      const orderData = await res.json();
      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || 'Failed to initialize transaction order.');
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay client script failed to load. Check your internet connection.');
      }

      // 3. Launch Razorpay Checkout Overlay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'TESCA Spoken English',
        description: `Enrollment - ${selectedPlanForPurchase.name} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setIsPurchasing(true);
            setPaymentError(null);

            const verifyRes = await fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                name: checkoutForm.name,
                email: checkoutForm.email,
                phone: checkoutForm.phone,
                city: checkoutForm.city,
                planId: selectedPlanForPurchase.id,
                billing: billing,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaymentSuccess(true);
            } else {
              setPaymentError(verifyData.error || 'Payment validation failed.');
            }
          } catch (err: any) {
            setPaymentError(err.message || 'Signature verification call encountered an error.');
          } finally {
            setIsPurchasing(false);
          }
        },
        prefill: {
          name: checkoutForm.name,
          email: checkoutForm.email,
          contact: checkoutForm.phone,
        },
        notes: {
          city: checkoutForm.city,
        },
        theme: {
          color: '#0b3336',
        },
        modal: {
          ondismiss: function () {
            setIsPurchasing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setPaymentError(err.message || 'An error occurred during payment setup.');
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getSystemSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings in PricingPage', err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get('plan');
      if (planParam) {
        const match = PLANS.find(p => p.id === planParam);
        if (match) {
          setSelectedPlanForPurchase(match);
        }
      }
    }
  }, []);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://tesca.co'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Pricing',
        'item': 'https://tesca.co/pricing'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Cards ── */}
        <section className="pb-20 lg:pb-28">
          <div className="container-x">
            {/* Countdown Promo Card */}
            {(settings.showOfferBanner && (settings.showTimer || settings.showProgressBar)) && (
              <div className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062426] to-[#0c4447] border border-primary/20 px-6 py-6 sm:px-10 text-white shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Background glows */}
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-secondary/15 blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />
                </div>
                
                <div className="relative z-10 flex-1 space-y-3 text-center md:text-left">
                  <span className="inline-flex items-center gap-1 bg-secondary/25 border border-secondary/40 text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    ⚡ Limited Time Promotion
                  </span>
                  <h3 className="text-xl font-bold font-heading">
                    Enroll Today & Save!
                  </h3>
                  {settings.showProgressBar && (
                    <div className="space-y-1.5 max-w-md mx-auto md:mx-0">
                      <p className="text-xs text-primary-100 font-semibold">
                        {settings.progressBarText.replace('[percentage]', String(settings.claimedPercentage))}
                      </p>
                      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-secondary to-amber-400 transition-all duration-1000 ease-out"
                          style={{ width: `${settings.claimedPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {settings.showTimer && (
                  <div className="relative z-10 flex flex-col items-center gap-1.5 shrink-0 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-soft w-full md:w-auto">
                    <span className="text-[10px] text-primary-200 font-bold uppercase tracking-widest flex items-center gap-1">
                      Offer Ends In:
                    </span>
                    <CountdownTimer expiryType={settings.timerExpiryType} fixedExpiry={settings.timerFixedExpiry} />
                  </div>
                )}
              </div>
            )}

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
                        onClick={() => handleGetStarted(plan)}
                        className={`flex w-full items-center justify-center cursor-pointer ${
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

      {/* Checkout Modal */}
      {selectedPlanForPurchase && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up max-h-[95vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedPlanForPurchase(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-50 text-green-600 border border-green-100 flex items-center justify-center shadow-soft animate-bounce">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">Payment Successful!</h3>
                <p className="text-sm text-gray-550 leading-relaxed max-w-sm mx-auto">
                  Thank you for enrolling in the <strong className="text-gray-800">{selectedPlanForPurchase.name}</strong> program! 
                  A confirmation email has been sent to <span className="font-semibold text-primary">{checkoutForm.email}</span>.
                </p>
                <div className="bg-gray-55 rounded-2xl p-4 border border-gray-100/80 text-left space-y-1.5 text-xs text-gray-650 max-w-sm mx-auto">
                  <p className="font-bold text-gray-800 mb-1">Enrollment Details:</p>
                  <p><span className="font-semibold text-gray-500">Name:</span> {checkoutForm.name}</p>
                  <p><span className="font-semibold text-gray-500">City:</span> {checkoutForm.city}</p>
                  <p><span className="font-semibold text-gray-500">Plan:</span> {selectedPlanForPurchase.name} ({selectedPlanForPurchase.duration})</p>
                  <p><span className="font-semibold text-gray-500">Payment Status:</span> Completed via Razorpay</p>
                </div>
                <div className="pt-4">
                  <a
                    href="/login"
                    className="btn-primary inline-flex justify-center px-6 py-3 w-full rounded-xl text-sm font-bold shadow-soft"
                  >
                    Go to Student Portal
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100 inline-block">
                    Enrollment Checkout
                  </span>
                  <h3 className="text-lg font-heading font-extrabold text-gray-850 tracking-tight">
                    Join {selectedPlanForPurchase.name} Plan
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    Please provide your contact information to initiate the secure payment gateway.
                  </p>
                </div>

                {paymentError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold leading-relaxed flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <form onSubmit={handlePurchaseSubmit} className="space-y-3.5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Full Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Email Address <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-500">Phone Number <span className="text-rose-500">*</span></label>
                      <span className={`text-[10px] font-semibold transition-colors ${checkoutForm.phone.length === 10 ? 'text-green-600' : 'text-gray-400'}`}>
                        {checkoutForm.phone.length} / 10 digits
                      </span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={checkoutForm.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setCheckoutForm({ ...checkoutForm, phone: val });
                      }}
                      className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                      required
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">City <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                      className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                      required
                    />
                  </div>

                  {/* Pricing Summary */}
                  <div className="border-t border-b border-gray-100 py-3 mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>Subtotal:</span>
                      <span>
                        ₹{(billing === 'monthly'
                          ? Math.ceil(selectedPlanForPurchase.price / (selectedPlanForPurchase.duration === '3 Months' ? 3 : selectedPlanForPurchase.duration === '4 Months' ? 4 : 6))
                          : selectedPlanForPurchase.price
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>Taxes & Processing Fees:</span>
                      <span className="text-green-600 font-semibold">Included</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-800 font-extrabold pt-1">
                      <span>Total Amount:</span>
                      <span className="text-primary">
                        ₹{(billing === 'monthly'
                          ? Math.ceil(selectedPlanForPurchase.price / (selectedPlanForPurchase.duration === '3 Months' ? 3 : selectedPlanForPurchase.duration === '4 Months' ? 4 : 6))
                          : selectedPlanForPurchase.price
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="flex items-start gap-2 pt-1.5 pb-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-[10px] text-gray-500 font-medium leading-normal cursor-pointer select-none">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Terms of Service</a>,{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Privacy Policy</a>, and{' '}
                      <a href="/refund" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Refund Policy (Strict No-Refund)</a>.
                    </label>
                  </div>

                  <div className="flex gap-3 justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPlanForPurchase(null)}
                      className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-50"
                      disabled={isPurchasing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPurchasing}
                      className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-soft flex items-center justify-center gap-1.5"
                    >
                      {isPurchasing ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        'Pay with Razorpay'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <FloatingActions />
    </div>
  );
}