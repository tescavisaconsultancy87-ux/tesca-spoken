'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { CheckCircle, X, ArrowRight, Clock, Star, Zap, ChevronDown, Users } from 'lucide-react';
import { useDemoModal } from '@/context/DemoModalContext';
import { db } from '@/lib/db';
import { PRICING_FAQS, COURSES } from '@/lib/data/content';

// Difficulty helper — determines the difficulty label from the course TITLE
function getDifficulty(title: string): string {
  const t = (title || '').toLowerCase();
  if (t.includes('basic') || t.includes('starter') || t.includes('day to day') || t.includes('day-to-day')) return 'Beginner';
  if (t.includes('intermediate') || t.includes('professional')) return 'Intermediate';
  if (t.includes('advanced') || t.includes('business') || t.includes('business-communication') || t.includes('communication')) return 'Advanced';
  if (t.includes('ielts') || t.includes('pte')) return 'Intermediate to Advanced';
  if (t.includes('interview') || t.includes('career') || t.includes('accelerator')) return 'All Levels';
  return 'Intermediate';
}

// Image / visual metadata helper — uses the course ID (database slug) to preserve original images
function getCourseMeta(courseId: string, courseTitle: string) {
  const normalized = (courseId || courseTitle || '').toLowerCase();
  const difficulty = getDifficulty(courseTitle || courseId);
  
  if (normalized.includes('basic') || normalized.includes('starter') || normalized.includes('spoken-english-basic') || normalized.includes('day to day') || normalized.includes('day-to-day')) {
    return {
      subtitle: 'Build strong grammar foundations and start speaking confidently.',
      difficulty,
      rating: '4.8',
      students: '5,400+',
      liveClasses: '48 Live Classes',
      certificate: 'Certificate Included',
      imageUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('advanced') || normalized.includes('business') || normalized.includes('business-communication') || normalized.includes('communication') || normalized.includes('professional')) {
    return {
      subtitle: 'Master public speaking, business communication, and neutral accent.',
      difficulty,
      rating: '4.9',
      students: '6,400+',
      liveClasses: '64 Live Classes',
      certificate: 'Certificate Included',
      imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('ielts')) {
    return {
      subtitle: 'Targeted preparation to clear IELTS Academic & General with Band 7.5+.',
      difficulty,
      rating: '4.9',
      students: '3,850+',
      liveClasses: '36 Live Classes',
      certificate: 'Score Report Included',
      imageUrl: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('pte')) {
    return {
      subtitle: 'Master PTE Academic using smart templates and AI-scored mock tests.',
      difficulty,
      rating: '4.8',
      students: '2,900+',
      liveClasses: '30 Live Classes',
      certificate: 'AI Report Included',
      imageUrl: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('interview') || normalized.includes('career') || normalized.includes('accelerator')) {
    return {
      subtitle: 'Crack MNC interviews with resume building, mock rounds, and HR prep.',
      difficulty,
      rating: '4.9',
      students: '1,800+',
      liveClasses: '20 Live Classes',
      certificate: 'Placement Support',
      imageUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-rose-500/10 via-red-500/5 to-transparent',
    };
  }
  
  return {
    subtitle: 'Enhance your communication skills with structured, certified training.',
    difficulty,
    rating: '4.8',
    students: '2,000+',
    liveClasses: 'Live Classes Included',
    certificate: 'Certificate Included',
    imageUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=600',
    bgGradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
  };
}




function PricingFaqItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-black/6 bg-white shadow-soft overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left cursor-pointer"
      >
        <span className="font-heading text-sm font-bold text-ink">{faq.question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-60 pb-5' : 'max-h-0'
        }`}
      >
        <p className="px-5 text-sm text-ink-muted leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  );
}

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

  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeLeft());
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryType, fixedExpiry]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        {[
          { value: '00', label: 'Hrs' },
          { value: '00', label: 'Min' },
          { value: '00', label: 'Sec' },
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

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      let msg = err.message || 'An error occurred during payment setup.';
      if (msg.includes('receipt') || msg.includes('validation') || msg.includes('Razorpay') || msg.includes('400') || msg.includes('500')) {
        msg = 'Unable to initialize secure checkout. Please refresh the page or try again in a few moments.';
      }
      setPaymentError(msg);
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const settingsData = await db.getSystemSettings();
        setSettings(settingsData);
      } catch (err) {
        console.error('Failed to load settings in PricingPage', err);
      }

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
            price: Number(c.price || 0),
            originalPrice: Number(c.original_price || c.price || 0),
            popular: !!c.popular,
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
              price: Number(c.price.replace(/[₹,]/g, '')),
              originalPrice: Number(c.originalPrice.replace(/[₹,]/g, '')),
              popular: c.popular,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load courses on pricing page:', err);
        setCourses(
          COURSES.map((c) => ({
            id: c.title.toLowerCase().replace(/\s+/g, '-'),
            title: c.title,
            duration: c.duration,
            accent: c.accent,
            benefits: c.benefits,
            price: Number(c.price.replace(/[₹,]/g, '')),
            originalPrice: Number(c.originalPrice.replace(/[₹,]/g, '')),
            popular: c.popular,
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && courses.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get('plan');
      if (planParam) {
        const match = courses.find(
          (p) =>
            p.id === planParam ||
            p.id.toLowerCase().includes(planParam.toLowerCase()) ||
            p.title.toLowerCase().includes(planParam.toLowerCase())
        );
        if (match) {
          setSelectedPlanForPurchase(match);
        }
      }
    }
  }, [courses]);

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
                  Choose the plan that fits your goals. Try a free demo class before you commit
                  to experience our teaching quality first-hand.
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

            {loading ? (
              <div className="col-span-full py-12 text-center text-ink-muted">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-2 text-xs font-semibold">Loading courses...</p>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3 items-stretch">
                {courses.map((plan) => {
                  const isPopular = plan.popular;
                  const meta = getCourseMeta(plan.id, plan.title);
                  
                  const divisor = plan.duration.includes('3') ? 3 : plan.duration.includes('4') ? 4 : plan.duration.includes('5') ? 5 : plan.duration.includes('6') ? 6 : 1;
                  const displayPrice =
                    billing === 'monthly'
                      ? Math.ceil(plan.price / divisor)
                      : plan.price;
                  const savings = Math.round(
                    ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
                  );

                  const displayPriceFormatted = `₹${displayPrice.toLocaleString('en-IN')}`;
                  const displayOriginalPriceFormatted = `₹${plan.originalPrice.toLocaleString('en-IN')}`;

                  return (
                    <article
                      key={plan.id}
                      className={`group relative flex flex-col overflow-hidden rounded-[24px] transition-all duration-300 ease-out hover:-translate-y-2 ${
                        isPopular
                          ? 'bg-gradient-to-br from-[#0F766E] via-[#F97316] to-[#0F766E] p-[2px] shadow-[0_12px_40px_rgba(249,120,35,0.15)] hover:shadow-[0_24px_50px_rgba(249,120,35,0.25)]'
                          : 'border border-[#E8EDF3] bg-white shadow-soft hover:shadow-[0_20px_40px_rgba(15,118,110,0.12)]'
                      }`}
                    >
                      <div className="flex flex-col h-full w-full bg-white rounded-[22px] overflow-hidden">
                        {/* Top Course Visual Cover image */}
                        <div className="relative h-[155px] w-full overflow-hidden bg-slate-50 border-b border-[#E8EDF3]/50">
                          <img 
                            src={meta.imageUrl} 
                            alt={plan.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          
                          {/* Gradient tint overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                          {/* Top floating difficulty badge */}
                          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap z-10">
                            <span className="rounded-full bg-white/95 backdrop-blur-sm border border-[#E8EDF3] px-2.5 py-0.5 text-[10px] font-bold text-[#0F172A] shadow-xs">
                              {meta.difficulty}
                            </span>
                          </div>

                          {/* Ribbon / Floating Badge for Popular plan */}
                          {isPopular && (
                            <div className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-[#F97316] to-[#E05E00] px-3 py-1 text-[9px] font-black text-white uppercase tracking-wider shadow-xs z-20">
                              ★ Most Popular
                            </div>
                          )}

                          {/* Best Value Tag */}
                          {!isPopular && (plan.id?.includes('basic') || plan.id?.includes('day-to-day') || plan.title?.toLowerCase().includes('day to day') || plan.title?.toLowerCase().includes('starter')) && (
                            <div className="absolute top-3 right-3 rounded-full bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-[9px] font-bold text-teal-700 uppercase tracking-wide z-20">
                              Best Value
                            </div>
                          )}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            {/* Plan Title & Tagline/Subtitle */}
                            <h3 className="font-heading text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#0F766E] transition-colors duration-250">
                              {plan.title}
                            </h3>
                            <p className="text-[13px] leading-relaxed text-[#64748B] mt-1.5 font-medium min-h-[40px]">
                              {meta.subtitle}
                            </p>

                            {/* Trust Section as pills */}
                            <div className="mt-4 flex flex-wrap gap-1.5">
                              <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
                                ⭐ {meta.rating} Rating
                              </span>
                              <span className="flex items-center gap-1 rounded-full bg-slate-50 border border-[#E8EDF3] px-2 py-0.5 text-[10px] font-bold text-[#0F172A] shadow-2xs">
                                <Users className="h-3 w-3 text-[#0F766E]" />
                                {meta.students} Students
                              </span>
                              <span className="flex items-center gap-1 rounded-full bg-teal-50 border border-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 shadow-2xs">
                                <Clock className="h-3 w-3 text-teal-700" />
                                {plan.duration} Program
                              </span>
                            </div>

                            {/* Learning Benefits / Features */}
                            <div className="mt-5 pt-4 border-t border-slate-100">
                              <p className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] mb-2.5">
                                What&apos;ll You Get
                              </p>
                              <ul className="space-y-2">
                                {plan.benefits.map((benefit: string) => (
                                  <li key={benefit} className="flex items-start gap-2.5 text-xs text-[#0F172A] font-medium leading-tight">
                                    <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Pricing and CTAs */}
                          <div className="mt-6 pt-5 border-t border-slate-100">
                            <div className="flex items-baseline justify-between mb-4.5">
                              <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-black text-[#0F172A] tracking-tight">{displayPriceFormatted}</span>
                                  {plan.originalPrice && plan.originalPrice !== plan.price && (
                                    <span className="text-xs text-[#64748B] line-through font-semibold">{displayOriginalPriceFormatted}</span>
                                  )}
                                </div>
                                {billing === 'monthly' && (
                                  <span className="text-[10px] text-[#64748B] font-semibold mt-0.5">per month (for {divisor} months)</span>
                                )}
                              </div>
                              {(() => {
                                if (plan.originalPrice && plan.price && plan.originalPrice > plan.price) {
                                  return (
                                    <span className="rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                                      Save {savings}%
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </div>

                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleGetStarted(plan)}
                                className={`w-full flex justify-center items-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 shadow-2xs group hover:shadow-xs cursor-pointer ${
                                  isPopular
                                    ? 'bg-gradient-to-r from-[#F97316] to-[#E05E00] hover:from-[#e45f0e] hover:to-[#b63d00] text-white hover:brightness-105'
                                    : 'bg-[#0F766E] hover:bg-[#0d645e] text-white'
                                }`}
                              >
                                Enroll Now
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </button>
                              <button
                                onClick={openModal}
                                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-[#0F172A] border border-[#E8EDF3] bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                              >
                                Book Free Demo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Feature Comparison Table ── */}
        {!loading && courses.length > 0 && (
          <section className="bg-[#062426] py-20 lg:py-28">
            <div className="container-x">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Compare Plans
                </span>
                <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Side-by-Side Comparison
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-primary-100/85">
                  See exactly what&apos;s included in each plan to find the best fit.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 pr-4 text-sm font-bold text-primary-200 w-1/4">Feature</th>
                      {courses.map((plan) => (
                        <th key={plan.id} className="py-4 px-4 text-center">
                          <span className={`text-sm font-bold ${plan.popular ? 'text-secondary' : 'text-white'}`}>
                            {plan.title}
                          </span>
                          {plan.popular && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-secondary bg-secondary/20 px-2 py-0.5 rounded-full">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              Popular
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <td className="py-3.5 pr-4 text-sm font-semibold text-primary-100">Duration</td>
                      {courses.map((c) => (
                        <td key={c.id} className="py-3.5 px-4 text-center text-sm text-white/80">{c.duration}</td>
                      ))}
                    </tr>
                    
                    {/* Benefits comparison dynamically */}
                    {Array.from(new Set(courses.flatMap(c => c.benefits))).map((benefit, i) => (
                      <tr key={benefit} className={`border-b border-white/5 ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}>
                        <td className="py-3.5 pr-4 text-sm font-semibold text-primary-100">{benefit}</td>
                        {courses.map((c) => (
                          <td key={c.id} className="py-3.5 px-4 text-center text-sm text-white/80">
                            {c.benefits.includes(benefit) ? (
                              <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                            ) : (
                              <span className="text-white/20">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── Payment Options / EMI ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Flexible Payments
                </span>
                <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
                  Pay Your Way — EMI or Full Payment
                </h2>
                <p className="text-ink-muted leading-relaxed">
                  We understand that investing in education is a big decision. That&apos;s why we offer
                  flexible payment options so you can start learning without financial stress.
                </p>

                <div className="space-y-4 pt-2">
                  {[
                    {
                      title: 'Monthly EMI (0% Interest)',
                      desc: 'Split your fee into equal monthly installments. No extra charges, no hidden interest.',
                      tag: 'Flexible',
                    },
                    {
                      title: 'Full Payment (Save 10%)',
                      desc: 'Pay the complete amount upfront and enjoy an instant 10% discount on any plan.',
                      tag: 'Best Value',
                    },
                    {
                      title: 'Secure Razorpay Checkout',
                      desc: 'UPI, cards, net banking, wallets — all accepted. PCI-DSS compliant and encrypted.',
                      tag: 'Secure',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-black/5 bg-bg-soft p-5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary shrink-0">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-sm font-bold text-ink">{item.title}</h3>
                          <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary uppercase">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-muted">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-black/5 p-8 shadow-soft-lg">
                  <h3 className="font-heading text-xl font-bold text-ink mb-6">Payment Example</h3>
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white p-5 border border-black/5 shadow-soft">
                      <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">Professional Plan — Full Payment</p>
                      <p className="text-3xl font-bold font-heading text-ink">₹12,999</p>
                      <p className="text-sm text-ink-muted mt-1">One-time payment • Save 10%</p>
                    </div>
                    <div className="text-center text-xs font-bold text-ink-muted uppercase tracking-wide">or</div>
                    <div className="rounded-2xl bg-white p-5 border border-black/5 shadow-soft">
                      <p className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-2">Professional Plan — Monthly EMI</p>
                      <p className="text-3xl font-bold font-heading text-ink">₹3,250<span className="text-base font-medium text-ink-muted">/mo</span></p>
                      <p className="text-sm text-ink-muted mt-1">4 months • 0% interest</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing FAQ ── */}
        <section className="py-20 lg:py-28 bg-bg-soft">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                Pricing & Payment Questions
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-ink-muted">
                Everything you need to know about our plans, payments, and refund policy.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {PRICING_FAQS.map((faq, i) => (
                <PricingFaqItem key={faq.question} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 lg:py-28">
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

                {/* Billing toggle inside the modal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Choose Payment Method</label>
                  <div className="flex gap-2 p-1 bg-gray-50 border border-gray-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setBilling('full')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        billing === 'full' ? 'bg-primary text-white shadow-soft' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Full Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setBilling('monthly')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                        billing === 'monthly' ? 'bg-primary text-white shadow-soft' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Monthly EMI
                    </button>
                  </div>
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