'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Building2,
  Globe,
  MessageSquareQuote,
  Zap,
  Target,
  GraduationCap,
  Sparkles,
  Rocket,
  Briefcase,
  Megaphone,
  UserCheck,
  ShieldCheck,
  HeartHandshake,
  LucideIcon,
} from 'lucide-react';

import type { TargetAndTransition } from 'framer-motion';

interface IconConfig {
  Component: LucideIcon;
  color: string;
  hover: TargetAndTransition;
}

/* ── 4 TESCA Branches in Surat with Direct Google Review Links ── */
const BRANCHES: Array<{
  id: string;
  name: string;
  label: string;
  iconConfig: IconConfig;
  reviewUrl: string;
}> = [
  {
    id: 'sarthana',
    name: 'Sarthana',
    label: 'Sarthana (HO)',
    iconConfig: {
      Component: Building2,
      color: '#E11D48',
      hover: { y: -3, scale: 1.25, transition: { type: 'spring', stiffness: 450, damping: 14 } },
    },
    reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJs1mzR4ZP4DsR_nxj9fVK9hE',
  },
  {
    id: 'mota-varachha',
    name: 'Mota Varachha',
    label: 'Mota Varachha',
    iconConfig: {
      Component: MapPin,
      color: '#059669',
      hover: { y: -3, scale: 1.25, transition: { type: 'spring', stiffness: 450, damping: 14 } },
    },
    reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ--Crp_9P4DsRkebwB7VAwdc',
  },
  {
    id: 'hirabaug',
    name: 'Hirabaug',
    label: 'Hirabaug',
    iconConfig: {
      Component: MapPin,
      color: '#4F46E5',
      hover: { y: -3, scale: 1.25, transition: { type: 'spring', stiffness: 450, damping: 14 } },
    },
    reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJqWBkuQRP4DsRBkUta6iHrtQ',
  },
  {
    id: 'yogichowk',
    name: 'Yogichowk',
    label: 'Yogichowk',
    iconConfig: {
      Component: MapPin,
      color: '#D97706',
      hover: { y: -3, scale: 1.25, transition: { type: 'spring', stiffness: 450, damping: 14 } },
    },
    reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJRRqbCQBP4DsRIA3B-fYSDXk',
  },
];

/* ── Spoken English Courses (2 Columns matching original design) ── */
const COURSES: Array<{
  value: string;
  label: string;
  iconConfig: IconConfig;
}> = [
  {
    value: '',
    label: 'All',
    iconConfig: {
      Component: Globe,
      color: '#0284C7',
      hover: { rotate: 180, scale: 1.22, transition: { duration: 0.45, ease: 'easeOut' } },
    },
  },
  {
    value: 'Spoken English',
    label: 'Spoken English',
    iconConfig: {
      Component: MessageSquareQuote,
      color: '#7C3AED',
      hover: { scale: [1, 1.25, 1.18], rotate: [-6, 6, 0], transition: { duration: 0.35 } },
    },
  },
  {
    value: 'Fluency & Accent',
    label: 'Fluency & Accent',
    iconConfig: {
      Component: Zap,
      color: '#F59E0B',
      hover: { scale: 1.25, rotate: [-12, 12, -6, 0], transition: { duration: 0.35 } },
    },
  },
  {
    value: 'IELTS Prep',
    label: 'IELTS Prep',
    iconConfig: {
      Component: Target,
      color: '#DC2626',
      hover: { scale: [1, 1.28, 1.2], rotate: 90, transition: { duration: 0.35 } },
    },
  },
  {
    value: 'PTE Academic',
    label: 'PTE Academic',
    iconConfig: {
      Component: GraduationCap,
      color: '#2563EB',
      hover: { y: -3, rotate: [-8, 8, 0], scale: 1.22, transition: { duration: 0.35 } },
    },
  },
  {
    value: 'Basic English',
    label: 'Basic English',
    iconConfig: {
      Component: Sparkles,
      color: '#10B981',
      hover: { rotate: [0, 45, 0], scale: 1.25, transition: { duration: 0.4 } },
    },
  },
  {
    value: 'Advanced Speaking',
    label: 'Adv. Speaking',
    iconConfig: {
      Component: Rocket,
      color: '#EA580C',
      hover: { x: 3, y: -4, scale: 1.25, transition: { duration: 0.35 } },
    },
  },
  {
    value: 'Business English',
    label: 'Business Eng.',
    iconConfig: {
      Component: Briefcase,
      color: '#0D9488',
      hover: { rotate: [-10, 10, -5, 0], scale: 1.22, transition: { duration: 0.35 } },
    },
  },
  {
    value: 'Public Speaking',
    label: 'Public Speaking',
    iconConfig: {
      Component: Megaphone,
      color: '#9333EA',
      hover: { rotate: [-8, 8, 0], scale: 1.25, transition: { duration: 0.35 } },
    },
  },
  {
    value: 'Interview Prep',
    label: 'Interview Prep',
    iconConfig: {
      Component: UserCheck,
      color: '#DB2777',
      hover: { y: -3, scale: 1.25, transition: { duration: 0.35 } },
    },
  },
];

/* ── Spoken English Highlights (4 Options matching original design) ── */
const HIGHLIGHTS: Array<{
  value: string;
  label: string;
  iconConfig: IconConfig;
}> = [
  {
    value: '',
    label: 'All',
    iconConfig: {
      Component: Globe,
      color: '#0284C7',
      hover: { rotate: 180, scale: 1.22, transition: { duration: 0.45 } },
    },
  },
  {
    value: 'Fluency & Speaking',
    label: 'Fluency & Speaking',
    iconConfig: {
      Component: MessageSquareQuote,
      color: '#7C3AED',
      hover: { scale: 1.25, rotate: [-6, 6, 0], transition: { duration: 0.35 } },
    },
  },
  {
    value: 'Confidence Building',
    label: 'Confidence Building',
    iconConfig: {
      Component: ShieldCheck,
      color: '#D97706',
      hover: { scale: [1, 1.25, 1.2], transition: { duration: 0.35 } },
    },
  },
  {
    value: 'Friendly Trainers',
    label: 'Friendly Trainers',
    iconConfig: {
      Component: HeartHandshake,
      color: '#059669',
      hover: { y: -3, scale: 1.22, transition: { duration: 0.35 } },
    },
  },
];

/* ── Open Source Animated High-Dimension Icon Component ── */
function AnimatedOptionIcon({
  iconConfig,
  isActive,
}: {
  iconConfig: IconConfig;
  isActive: boolean;
}) {
  const { Component, color, hover } = iconConfig;

  return (
    <motion.span
      className="inline-flex items-center justify-center shrink-0 transition-colors duration-200"
      variants={{
        rest: { scale: 1, rotate: 0, x: 0, y: 0 },
        hover,
      }}
      style={{
        color: isActive ? '#FFFFFF' : color,
        filter: isActive
          ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.7))'
          : `drop-shadow(0 2px 4px ${color}35)`,
      }}
    >
      <Component size={17} strokeWidth={2.3} />
    </motion.span>
  );
}

/* ── Tailored Spoken English Fallback Reviews per Branch ── */
const SPOKEN_FALLBACKS = [
  'Enrolled at TESCA {branch} branch to improve my spoken English for job interviews. The personal attention, mock interviews, and confidence-building sessions were fantastic. Grateful to the entire TESCA team!',
  'Joined TESCA Spoken English at the {branch} branch and my speaking confidence improved drastically. The trainers are patient, friendly, and focus on practical conversation rather than boring grammar rules. Best spoken English classes in Surat!',
  'Had an incredible learning experience at TESCA {branch} branch. The interactive group discussions and personal speaking practice helped me overcome my stage fear and hesitate less in daily English communication.',
  'Highly recommend TESCA {branch} for spoken English! The faculty explains concepts simply and encourages everyone to speak without hesitation. My fluency and vocabulary improved noticeably in just a few weeks.',
  'TESCA is hands down the best English speaking institute in Surat. Friendly trainers at the {branch} campus, supportive batchmates, and daily speaking activities made learning enjoyable and completely natural. 5-star coaching!',
  'Very smooth and clear learning process. The team at TESCA {branch} was highly supportive, and their personalized speaking sessions helped me speak English with total confidence.',
];

function getLocalFallback(branchName: string): string {
  const tmpl = SPOKEN_FALLBACKS[Math.floor(Math.random() * SPOKEN_FALLBACKS.length)];
  return tmpl.replace(/\{branch\}/g, branchName);
}

export default function ReviewGeneratorClient() {
  const [selectedBranch, setSelectedBranch] = useState<string>('sarthana');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedHighlight, setSelectedHighlight] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copyStatus, setCopyStatus] = useState<string>('Ready to copy');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitialMount = useRef<boolean>(true);

  const currentBranchObj = BRANCHES.find((b) => b.id === selectedBranch) || BRANCHES[0];

  /* ── Generate Review ── */
  const generateReview = useCallback(
    async (
      branchId = selectedBranch,
      course = selectedCourse,
      highlight = selectedHighlight,
    ) => {
      setIsLoading(true);
      setCopyStatus('Generating...');
      setIsCopied(false);

      const branchObj = BRANCHES.find((b) => b.id === branchId) || BRANCHES[0];
      const startTime = Date.now();

      try {
        const res = await fetch('/api/generate-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'spoken',
            branch: branchObj.name,
            course: course || 'Spoken English',
            highlight: highlight || 'Fluency & Speaking',
          }),
        });

        let generated = '';
        if (res.ok) {
          const data = await res.json();
          generated = data.review?.trim() || getLocalFallback(branchObj.name);
        } else {
          generated = getLocalFallback(branchObj.name);
        }

        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 400 - elapsed);
        if (remainingDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }

        setReviewText(generated);
      } catch {
        setReviewText(getLocalFallback(branchObj.name));
      } finally {
        setIsLoading(false);
        setCopyStatus('Ready to copy');
      }
    },
    [selectedBranch, selectedCourse, selectedHighlight],
  );

  /* Auto-generate initial review on mount */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      generateReview('sarthana', '', '');
    }
  }, [generateReview]);

  /* ── Clipboard Copy Helper ── */
  const copyTextToClipboard = (text: string): boolean => {
    if (!text || text === 'Generating your review...') return false;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      return true;
    }
    return fallbackCopy(text);
  };

  const fallbackCopy = (text: string): boolean => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  /* ── Quick Copy Button inside Textarea ── */
  const handleQuickCopy = () => {
    const text = reviewText || '';
    if (copyTextToClipboard(text)) {
      setIsCopied(true);
      setCopyStatus('Copied to clipboard!');
      setTimeout(() => {
        setIsCopied(false);
        setCopyStatus('Ready to copy');
      }, 2000);
    }
  };

  /* ── Primary Action: Copy & Redirect to Branch Google Reviews ── */
  const handleSubmit = () => {
    const text = reviewText || '';
    if (!text || isLoading || text === 'Generating your review...' || text.startsWith('Error:')) {
      alert('Please wait for the review to finish generating.');
      return;
    }

    copyTextToClipboard(text);
    setCopyStatus('Copied! Redirecting...');
    setIsCopied(true);

    const targetUrl = currentBranchObj.reviewUrl;

    if (typeof window !== 'undefined') {
      window.alert(
        `Review copied to clipboard! Opening Google Reviews for TESCA ${currentBranchObj.name} Branch...`,
      );
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 300);
    }
  };

  /* ── Branch Pill Click ── */
  const handleBranchClick = (branchId: string) => {
    setSelectedBranch(branchId);
    generateReview(branchId, selectedCourse, selectedHighlight);
  };

  /* ── Course Pill Click ── */
  const handleCourseClick = (val: string) => {
    setSelectedCourse(val);
    generateReview(selectedBranch, val, selectedHighlight);
  };

  /* ── Highlight Pill Click ── */
  const handleHighlightClick = (val: string) => {
    setSelectedHighlight(val);
    generateReview(selectedBranch, selectedCourse, val);
  };

  return (
    <main className="min-h-screen bg-slate-50/70 py-4 sm:py-8 px-3.5 sm:px-6 flex flex-col items-center justify-center select-none md:select-auto font-sans antialiased text-slate-800 relative">
      <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">

        {/* ── Top Brand & Trust Header (Exact Copy from tesca_website) ── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
            <img
              src="/images/Tesca_logo.png"
              alt="TESCA Spoken English"
              className="h-7 sm:h-9 w-auto object-contain"
            />
          </a>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/70 px-3 py-1.5 rounded-full text-amber-800 text-xs font-bold font-sans shadow-2xs">
            <span className="text-amber-500 text-xs sm:text-sm">★★★★★</span>
            <span className="hidden xs:inline">5.0 Google Review</span>
            <span className="xs:hidden">5.0</span>
          </div>
        </div>

        {/* ── Main Review Generator Card ── */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 shadow-xl relative text-left w-full">
          <div className="space-y-5 sm:space-y-6">

            {/* Card Title & Instructions */}
            <div className="space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Google Review Generator</span>
                </h1>
                <span className="text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider font-sans">
                  AI Powered
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
                Select options below to generate a natural review. Copy &amp; paste directly on Google Reviews!
              </p>
            </div>

            {/* ── Section 1: Branch Selection (SURAT) with Animated High-Dimension Icons ── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                  1. SELECT YOUR BRANCH <span className="text-indigo-600 font-bold">(SURAT)</span>
                </label>
                <span className="text-[10px] sm:text-xs text-slate-400 font-sans">
                  Redirects to selected branch
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BRANCHES.map((b) => {
                  const active = selectedBranch === b.id;
                  return (
                    <motion.button
                      key={b.id}
                      type="button"
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleBranchClick(b.id)}
                      style={
                        active
                          ? {
                              backgroundColor: '#4f46e5',
                              borderColor: '#4f46e5',
                              color: '#ffffff',
                              boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
                            }
                          : undefined
                      }
                      className={`group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[42px] ${
                        active
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <AnimatedOptionIcon iconConfig={b.iconConfig} isActive={active} />
                      <span className="font-semibold">{b.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 2: Course / Focus Area (2 Columns) with Animated High-Dimension Icons ── */}
            <div className="space-y-2">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                2. COURSE / FOCUS AREA <span className="text-slate-400 font-normal">(OPTIONAL)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COURSES.map((c) => {
                  const active = selectedCourse === c.value;
                  return (
                    <motion.button
                      key={c.value || 'all-courses'}
                      type="button"
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleCourseClick(c.value)}
                      style={
                        active
                          ? {
                              backgroundColor: '#4f46e5',
                              borderColor: '#4f46e5',
                              color: '#ffffff',
                              boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
                            }
                          : undefined
                      }
                      className={`group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[42px] ${
                        active
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <AnimatedOptionIcon iconConfig={c.iconConfig} isActive={active} />
                      <span className="font-semibold">{c.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 3: Key Benefit / Highlight with Animated High-Dimension Icons ── */}
            <div className="space-y-2">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                3. KEY BENEFIT / HIGHLIGHT <span className="text-slate-400 font-normal">(OPTIONAL)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {HIGHLIGHTS.map((h) => {
                  const active = selectedHighlight === h.value;
                  return (
                    <motion.button
                      key={h.value || 'all-highlights'}
                      type="button"
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleHighlightClick(h.value)}
                      style={
                        active
                          ? {
                              backgroundColor: '#4f46e5',
                              borderColor: '#4f46e5',
                              color: '#ffffff',
                              boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
                            }
                          : undefined
                      }
                      className={`group flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[42px] ${
                        active
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <AnimatedOptionIcon iconConfig={h.iconConfig} isActive={active} />
                      <span className="font-semibold">{h.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* ── Review Output Box ── */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="review-output-textarea"
                  className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider font-sans"
                >
                  GENERATED REVIEW (~30 WORDS)
                </label>
                <span className="text-[11px] font-semibold text-slate-400 font-sans">
                  {copyStatus}
                </span>
              </div>

              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  id="review-output-textarea"
                  rows={4}
                  value={isLoading ? 'Generating your review...' : reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 text-base sm:text-sm text-slate-800 leading-relaxed focus:outline-none resize-none font-sans font-medium transition-all shadow-inner select-all"
                  placeholder="Generating your review..."
                />
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(to right, #F08A00, #E07A00)',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(240, 138, 0, 0.35)',
                }}
                className="w-full sm:flex-1 py-3.5 sm:py-4 px-5 text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer font-sans tracking-wide active:scale-[0.98] min-h-[50px] disabled:opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                <span>Copy &amp; Go to Google Reviews</span>
              </button>

              <button
                type="button"
                onClick={() => generateReview()}
                disabled={isLoading}
                style={{
                  backgroundColor: '#0A7880',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px 0 rgba(10, 120, 128, 0.25)',
                }}
                className="w-full sm:w-auto py-3.5 sm:py-4 px-5 text-white font-bold text-sm sm:text-base rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer font-sans tracking-wide active:scale-[0.98] shrink-0 min-h-[50px] disabled:opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`shrink-0 ${isLoading ? 'animate-spin' : ''}`}
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                <span>Regenerate</span>
              </button>
            </div>

            {/* ── Steps Checklist / Instructions ── */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center text-[11px] text-slate-500 font-sans">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-[10px] mb-1">
                  1
                </span>
                <span>Select Options</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-[10px] mb-1">
                  2
                </span>
                <span>Copy Review</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-[10px] mb-1">
                  3
                </span>
                <span>Paste on Google</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer Copyright Link ── */}
        <div className="text-center">
          <p className="text-[11px] font-semibold text-slate-400 font-sans">
            © {new Date().getFullYear()} TESCA Spoken English. ISO 9001:2015 Certified.
          </p>
        </div>

      </div>
    </main>
  );
}
