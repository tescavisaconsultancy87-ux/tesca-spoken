'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import CoursesList from '@/components/CoursesList';
import { useDemoModal } from '@/context/DemoModalContext';
import { db } from '@/lib/db';
import { COURSES, TRAINERS, COURSE_FAQS } from '@/lib/data/content';
import { useState, useEffect, useRef, useCallback } from 'react';
import TrainerCard from '@/components/TrainerCard';
import Reveal from '@/components/Reveal';
import {
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Play,
  Users,
  Download,
  Video,
  MessageCircle,
  Award,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Star,
  X,
} from 'lucide-react';

const FEATURES = [
  { icon: Video, label: 'Live Interactive Classes' },
  { icon: Play, label: 'Recorded Video Lessons' },
  { icon: Download, label: 'Study Materials' },
  { icon: Users, label: 'Peer Practice Groups' },
  { icon: MessageCircle, label: 'WhatsApp Support' },
  { icon: BookOpen, label: 'Mock Tests & Quizzes' },
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
              <span className="font-heading text-xl font-bold text-white tabular-nums">{unit.value}</span>
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
      <span className="text-xs font-bold text-rose-300 uppercase tracking-widest py-2">Offer Expired</span>
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
            <span className="font-heading text-xl font-bold text-white tabular-nums">{unit.value}</span>
            <span className="text-[10px] text-primary-200 uppercase tracking-wide">{unit.label}</span>
          </div>
          {i < 2 && <span className="text-xl font-bold text-primary-300 mb-3">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function CoursesPage() {
  const { openModal } = useDemoModal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number>(0);

  // Dynamic trainers state
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState(true);

  // Banner / promo settings
  const [settings, setSettings] = useState({
    showOfferBanner: true,
    showTimer: true,
    timerExpiryType: 'rolling',
    timerFixedExpiry: '',
    showProgressBar: true,
    claimedPercentage: 85,
    progressBarText: '🔥 [percentage]% of promotional seats claimed',
  });

  // Search and tag filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Dynamic courses state
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const getFallbackTags = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('basic')) return ['Speaking', 'Basic', 'Grammar'];
    if (t.includes('advanced') || t.includes('interview') || t.includes('communication')) return ['Corporate', 'Speaking', 'Interview Prep'];
    if (t.includes('ielts') || t.includes('pte') || t.includes('vocabulary') || t.includes('accelerator')) return ['Vocabulary', 'IELTS', 'PTE'];
    return ['Speaking'];
  };

  const getFallbackKeywords = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('basic')) return ['spoken english', 'english speaking', 'conversation'];
    if (t.includes('advanced')) return ['business english', 'corporate training', 'advanced speaking'];
    if (t.includes('interview') || t.includes('communication')) return ['interview preparation', 'hr interview', 'mock interview', 'business communication'];
    if (t.includes('ielts')) return ['ielts preparation', 'ielts training', 'english test'];
    if (t.includes('pte')) return ['pte academic', 'pte test', 'pte practice'];
    if (t.includes('vocabulary') || t.includes('accelerator')) return ['english vocabulary', 'idioms', 'speaking vocabulary'];
    return ['english learning'];
  };

  // Trainer slider scroll states and handlers
  const trainersScrollContainerRef = useRef<HTMLDivElement>(null);
  const trainersLengthRef = useRef(0);
  const [trainersActiveIndex, setTrainersActiveIndex] = useState(0);
  const [trainersCanScrollLeft, setTrainersCanScrollLeft] = useState(false);
  const [trainersCanScrollRight, setTrainersCanScrollRight] = useState(false);
  const [trainersShowControls, setTrainersShowControls] = useState(false);

  useEffect(() => {
    trainersLengthRef.current = trainers.length;
  }, [trainers]);

  const updateTrainersScrollState = useCallback(() => {
    const container = trainersScrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const isOverflowing = maxScroll > 1;
    setTrainersShowControls(isOverflowing);
    setTrainersCanScrollLeft(scrollLeft > 1);
    setTrainersCanScrollRight(scrollLeft < maxScroll - 1);
    const len = trainersLengthRef.current;
    if (len === 0) return;
    let closestIndex = 0;
    let minDist = Infinity;
    for (let i = 0; i < len; i++) {
      const child = container.children[i] as HTMLElement | undefined;
      if (!child) continue;
      const dist = Math.abs(child.offsetLeft - scrollLeft);
      if (dist < minDist) { minDist = dist; closestIndex = i; }
    }
    setTrainersActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = trainersScrollContainerRef.current;
    if (!container || trainers.length === 0) return;
    const timer = setTimeout(updateTrainersScrollState, 50);
    container.addEventListener('scroll', updateTrainersScrollState, { passive: true });
    const ro = new ResizeObserver(updateTrainersScrollState);
    ro.observe(container);
    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', updateTrainersScrollState);
      ro.disconnect();
    };
  }, [trainers, updateTrainersScrollState]);

  const scrollTrainersToIndex = useCallback((index: number) => {
    const container = trainersScrollContainerRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;
    container.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  }, []);

  const handleTrainersPrev = useCallback(() => {
    setTrainersActiveIndex(prev => {
      const next = Math.max(0, prev - 1);
      scrollTrainersToIndex(next);
      return next;
    });
  }, [scrollTrainersToIndex]);

  const handleTrainersNext = useCallback(() => {
    setTrainersActiveIndex(prev => {
      const next = Math.min(trainersLengthRef.current - 1, prev + 1);
      scrollTrainersToIndex(next);
      return next;
    });
  }, [scrollTrainersToIndex]);



  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await db.getSystemSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    async function loadCourses() {
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
            tags: c.tags && c.tags.length > 0 ? c.tags : getFallbackTags(c.title),
            keywords: c.keywords && c.keywords.length > 0 ? c.keywords : getFallbackKeywords(c.title),
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
              tags: getFallbackTags(c.title),
              keywords: getFallbackKeywords(c.title),
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
            tags: getFallbackTags(c.title),
            keywords: getFallbackKeywords(c.title),
          }))
        );
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  useEffect(() => {
    if (courses.length > 0 && expandedCurriculum >= courses.length) {
      setExpandedCurriculum(0);
    }
  }, [courses, expandedCurriculum]);

  useEffect(() => {
    async function loadTrainers() {
      try {
        const data = await db.getTrainers();
        if (data && data.length > 0) {
          // Filter to show only active trainers configured for homepage/courses display
          const active = data.filter((t: any) => !!t.show_on_homepage);
          setTrainers(active);
        } else {
          setTrainers(TRAINERS.map((t, idx) => ({ ...t, id: `mock-${idx}`, show_on_homepage: true, verified: true })));
        }
      } catch (err) {
        console.error('Failed to fetch trainers, using mock fallback', err);
        setTrainers(TRAINERS.map((t, idx) => ({ ...t, id: `mock-${idx}`, show_on_homepage: true, verified: true })));
      } finally {
        setLoadingTrainers(false);
      }
    }
    loadTrainers();
  }, []);

  // Enrollment checkout states
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
  const [billing, setBilling] = useState<'monthly' | 'full'>('full');

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

  const handleEnroll = (course: any) => {
    setSelectedPlanForPurchase(course);
    setCheckoutForm({ name: '', email: '', phone: '', city: '' });
    setPaymentSuccess(false);
    setPaymentError(null);
    setAgreedToTerms(false);
    setBilling('full');
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
        description: `Enrollment - ${selectedPlanForPurchase.title || selectedPlanForPurchase.name}`,
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

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tesca.co' },
                  { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://tesca.co/courses' },
                ],
              },
              {
                '@type': 'ItemList',
                itemListElement: (courses && courses.length > 0 ? courses : COURSES).map((c: any, i: number) => ({
                  '@type': 'Course',
                  position: i + 1,
                  name: c.title || c.name,
                  description: Array.isArray(c.benefits) ? c.benefits.join(', ') : (c.benefits || ''),
                  provider: { '@type': 'EducationalOrganization', name: 'TESCA Spoken English', sameAs: 'https://tesca.co' },
                })),
              },
            ],
          }),
        }}
      />
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
              <div className="text-center lg:text-left lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  Focus on Learning
                </span>
                <h1 className="font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  Find Your Perfect
                  <br />
                  <span className="gradient-text">English Course</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
                  From complete beginners to IELTS aspirants — explore our curriculum,
                  meet the trainers, and pick the right course for your goals.
                </p>

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

              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[380px] lg:max-w-none aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white p-4 shadow-soft-lg">
                  <Image
                    src="/courses_hero.png"
                    alt="TESCA Courses Illustration"
                    fill
                    priority
                    sizes="(max-width: 768px) 380px, 450px"
                    className="object-contain p-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Promo Banner (from settings) ── */}
        {(settings.showOfferBanner && (settings.showTimer || settings.showProgressBar)) && (
          <div className="container-x mt-10 mb-0 lg:mb-0">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062426] to-[#0c4447] border border-primary/20 px-6 py-6 sm:px-10 text-white shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-secondary/15 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />
              </div>
              <div className="relative z-10 flex-1 space-y-3 text-center md:text-left">
                <span className="inline-flex items-center gap-1 bg-secondary/25 border border-secondary/40 text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  ⚡ Limited Time Promotion
                </span>
                <h3 className="text-xl font-bold font-heading">Enroll Today & Save!</h3>
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
          </div>
        )}

        {/* ── Course Cards (no pricing) ── */}
        <section className="py-20 lg:py-28" id="courses">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Our Courses</span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                Choose Your Learning Path
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-ink-muted">
                Each course is designed for a specific goal. Pick the one that matches your needs.
              </p>
            </div>

            {/* Search and tag filter UI */}
            {!loadingCourses && courses.length > 0 && (() => {
              const allTags = Array.from(new Set(courses.flatMap(c => c.tags || [])));
              return (
                <div className="max-w-4xl mx-auto mb-12 space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses by title, keywords or benefits..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-black/10 bg-white px-5 py-3.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-soft"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {allTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 justify-center">
                      <button
                        onClick={() => setSelectedTag(null)}
                        className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          !selectedTag
                            ? 'bg-primary text-white shadow-soft'
                            : 'bg-white border border-black/8 text-ink-muted hover:text-ink hover:border-black/15'
                        }`}
                      >
                        All Tags
                      </button>
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                            tag === selectedTag
                              ? 'bg-primary text-white shadow-soft'
                              : 'bg-white border border-black/8 text-ink-muted hover:text-ink hover:border-black/15'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center max-w-6xl mx-auto">
              <CoursesList 
                courses={courses.filter(c => {
                  const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (c.benefits && c.benefits.some((b: string) => b.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                    (c.keywords && c.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase())));
                  const matchesTag = !selectedTag || (c.tags && c.tags.includes(selectedTag));
                  return matchesSearch && matchesTag;
                })} 
                loading={loadingCourses} 
                onEnroll={handleEnroll} 
              />
            </div>
          </div>
        </section>

        {/* ── Who is this program for ── */}
        <section className="py-20 lg:py-24 bg-slate-50/30 relative overflow-hidden border-y border-[#E8EDF3]">
          {/* Faint blueprint grid background */}
          <div className="absolute inset-0 opacity-[0.2]" style={{
            backgroundImage: `linear-gradient(to right, #CBD5E1 1px, transparent 1px), linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />
          
          <div className="container-x relative z-10">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl font-extrabold text-[#1E3A8A] sm:text-4xl tracking-tight">
                Who&apos;s This Program For?
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {[
                "Software Engineers",
                "Teachers and educators",
                "Homemakers",
                "Working Professionals",
                "Corporate Trainers and public speakers",
                "Team leaders and managers",
                "Entrepreneurs and freelancers",
                "Individuals pursuing personal growth",
                "Sales professionals and content creators"
              ].map((audience, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:shadow-xs hover:border-[#1E3A8A]/30 transition-all duration-200"
                >
                  {/* Custom SVG Double Checkmark representing the visual in the user screenshot */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M2 12l3 3L13 7" />
                    <path d="M9 15l3 3L21 10" />
                  </svg>
                  <span className="font-bold text-sm text-slate-800 leading-tight">
                    {audience}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Curriculum Overview ── */}
        <section className="py-20 lg:py-28 bg-bg-soft">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <Layers className="h-3.5 w-3.5" />
                Curriculum
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                What You&apos;ll Learn — Module by Module
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-ink-muted">
                Every course is structured into focused modules with clear learning outcomes.
              </p>
            </div>

            {/* Course selector tabs */}
            {!loadingCourses && courses.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {courses.map((course, i) => (
                  <button
                    key={course.title}
                    onClick={() => setExpandedCurriculum(i)}
                    className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      expandedCurriculum === i
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-white border border-black/8 text-ink-muted hover:text-ink hover:border-black/15'
                    }`}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            )}

            {/* Selected course curriculum */}
            {loadingCourses ? (
              <div className="py-12 text-center text-ink-muted">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="mt-2 text-xs font-semibold text-ink-muted">Loading curriculum...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="py-12 text-center text-ink-muted">
                <p className="text-sm font-semibold">No curriculum available.</p>
              </div>
            ) : (
              (() => {
                const selectedCourse = courses[expandedCurriculum] || courses[0];
                if (!selectedCourse) return null;

                const staticMatch = COURSES.find(c => 
                  c.title.toLowerCase() === selectedCourse.title.toLowerCase() ||
                  c.title.toLowerCase().replace(/\s+/g, '-').includes(selectedCourse.id) ||
                  selectedCourse.id.includes(c.title.toLowerCase().replace(/\s+/g, '-'))
                ) || COURSES[0];

                return (
                  <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-ink">
                          {selectedCourse.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-ink-muted">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary" />
                            {selectedCourse.duration}
                          </span>
                          {selectedCourse.whoShouldJoin && (
                            <span className="hidden sm:flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-primary" />
                              {selectedCourse.whoShouldJoin}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={openModal}
                        className="btn-warm text-sm whitespace-nowrap cursor-pointer"
                      >
                        Book Free Demo
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {staticMatch.curriculum?.map((mod, i) => (
                        <div
                          key={mod.module}
                          className="rounded-2xl border border-black/6 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary font-heading text-sm font-bold">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <h4 className="font-heading text-base font-bold text-ink">{mod.module}</h4>
                          </div>
                          <ul className="space-y-2">
                            {mod.topics.map((topic) => (
                              <li key={topic} className="flex items-start gap-2 text-sm text-ink-soft">
                                <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/60" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {staticMatch.teachingMethod && (
                      <div className="mt-6 rounded-2xl border border-primary/10 bg-primary-50/50 p-5 flex items-start gap-3">
                        <BookOpen className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1">Teaching Method</p>
                          <p className="text-sm text-ink-soft leading-relaxed">{staticMatch.teachingMethod}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </section>

        {/* ── Teaching Method / What's Included ── */}
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

        {/* ── Our Trainers ── */}
        <section className="py-20 lg:py-28 overflow-hidden">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <GraduationCap className="h-3.5 w-3.5" />
                Expert Trainers
              </span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                Learn From the Best
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-ink-muted">
                Our trainers hold international certifications and have trained thousands of students across 25+ countries.
              </p>
            </div>
          </div>

            <div className="relative mt-12 lg:mt-16 w-full">
              {loadingTrainers ? (
                <div className="py-12 text-center text-gray-400">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="mt-2 text-xs font-semibold text-ink-muted">Loading trainers...</p>
                </div>
              ) : trainers.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-sm font-semibold text-ink-muted">No trainers configured.</p>
                </div>
              ) : (
                <>
                  <div className="relative -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
                    {/* Scrollable list */}
                    <div
                      ref={trainersScrollContainerRef}
                      className={`relative flex gap-6 py-4 items-stretch scroll-smooth no-scrollbar overflow-x-auto snap-x snap-mandatory ${
                        trainersShowControls
                          ? 'justify-start'
                          : 'justify-start lg:justify-center'
                      }`}
                    >
                      {trainers.map((trainer, i) => (
                        <Reveal
                          key={trainer.id || trainer.name}
                          delay={i * 80}
                          className="flex flex-col items-stretch shrink-0 snap-start w-[calc(100vw-2.5rem)] sm:w-[270px] h-full"
                        >
                          <TrainerCard trainer={trainer} />
                        </Reveal>
                      ))}
                      {trainersShowControls && <div className="shrink-0 w-4" />}
                    </div>

                    {/* Gradient Overlays */}
                    {trainersShowControls && trainersCanScrollLeft && (
                      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-white via-white/70 to-transparent" />
                    )}
                    {trainersShowControls && trainersCanScrollRight && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-white via-white/70 to-transparent" />
                    )}
                  </div>

                  {/* Controls */}
                  {trainersShowControls && (
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleTrainersPrev}
                        disabled={trainersActiveIndex === 0}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all duration-300 ${
                          trainersActiveIndex === 0
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:border-primary hover:bg-primary hover:text-white cursor-pointer active:scale-95'
                        }`}
                        aria-label="Previous trainer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Dots */}
                      <div className="flex gap-2">
                        {trainers.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => scrollTrainersToIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              i === trainersActiveIndex
                                ? 'w-8 bg-primary'
                                : 'w-2 bg-primary-200 hover:bg-primary-300'
                            }`}
                            aria-label={`Go to trainer ${i + 1}`}
                            aria-current={i === trainersActiveIndex}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleTrainersNext}
                        disabled={trainersActiveIndex === trainers.length - 1}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all duration-300 ${
                          trainersActiveIndex === trainers.length - 1
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:border-primary hover:bg-primary hover:text-white cursor-pointer active:scale-95'
                        }`}
                        aria-label="Next trainer"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
        </section>

        {/* ── Certification ── */}
        <section className="py-20 lg:py-28 bg-bg-soft">
          <div className="container-x">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 border border-primary-100 shadow-soft">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
                TESCA Certificate of Completion
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-muted leading-relaxed">
                Every student who completes 80% of their enrolled course receives a verified
                TESCA Certificate of Completion. IELTS and PTE students also receive a detailed
                mock score report to share with universities or employers.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-6">
                {[
                  'Verified digital certificate',
                  'Shareable on LinkedIn',
                  'Includes course details & duration',
                  'Mock score report for IELTS/PTE',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-ink-soft font-medium">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Course FAQ ── */}
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-ink sm:text-4xl">
                Common Questions About Our Courses
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-ink-muted">
                Everything you need to know before booking your free demo class.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {COURSE_FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-black/6 bg-white shadow-soft overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
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
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 lg:py-28 bg-bg-soft">
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
                  Book a free 45-minute demo class. Meet your trainer, experience our teaching style,
                  and get a personalized recommendation — no obligations.
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
                <p className="text-sm text-gray-555 leading-relaxed max-w-sm mx-auto">
                  Thank you for enrolling in the <strong className="text-gray-800">{selectedPlanForPurchase.title || selectedPlanForPurchase.name}</strong> program! 
                  A confirmation email has been sent to <span className="font-semibold text-primary">{checkoutForm.email}</span>.
                </p>
                <div className="bg-gray-55 rounded-2xl p-4 border border-gray-100/80 text-left space-y-1.5 text-xs text-gray-650 max-w-sm mx-auto">
                  <p className="font-bold text-gray-800 mb-1">Enrollment Details:</p>
                  <p><span className="font-semibold text-gray-500">Name:</span> {checkoutForm.name}</p>
                  <p><span className="font-semibold text-gray-500">City:</span> {checkoutForm.city}</p>
                  <p><span className="font-semibold text-gray-500">Course:</span> {selectedPlanForPurchase.title || selectedPlanForPurchase.name} ({selectedPlanForPurchase.duration})</p>
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
                    Join {selectedPlanForPurchase.title || selectedPlanForPurchase.name}
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
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
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
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
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
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
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
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                      required
                    />
                  </div>

                  {/* Pricing Summary */}
                  <div className="border-t border-b border-gray-100 py-3 mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                      <span>Subtotal:</span>
                      <span>
                        ₹{(billing === 'monthly'
                          ? Math.ceil(selectedPlanForPurchase.price / (selectedPlanForPurchase.duration?.includes('3') ? 3 : selectedPlanForPurchase.duration?.includes('4') ? 4 : selectedPlanForPurchase.duration?.includes('5') ? 5 : selectedPlanForPurchase.duration?.includes('6') ? 6 : 1))
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
                          ? Math.ceil(selectedPlanForPurchase.price / (selectedPlanForPurchase.duration?.includes('3') ? 3 : selectedPlanForPurchase.duration?.includes('4') ? 4 : selectedPlanForPurchase.duration?.includes('5') ? 5 : selectedPlanForPurchase.duration?.includes('6') ? 6 : 1))
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
