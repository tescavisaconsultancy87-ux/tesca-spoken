'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Send,
  CalendarCheck,
  Check,
  Clock,
  User,
  Phone,
  Mail,
  Award,
  Laptop,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { COURSES } from '@/lib/data/content';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
  DropdownMenuItem,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';

import { useToast } from '@/context/ToastContext';

interface DemoModalProps {
  onClose: () => void;
}

export default function DemoModal({ onClose }: DemoModalProps) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    time: '',
    mode: '',
    course: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  // Close modal on escape press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Fetch courses list from dynamic API or fall back to static list
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCourses(data.map((c: any) => ({ id: c.id, title: c.title })));
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
      // Fallback
      setCourses(COURSES.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), title: c.title })));
    }
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Phone validation: must be exactly 10 digits
    const cleanedPhone = form.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      const errMsg = 'Phone number must be exactly 10 digits.';
      setError(errMsg);
      toast.error(errMsg, 'Validation Error');
      return;
    }

    setLoading(true);

    const nameValue = form.name.trim() || 'Prospective Student';
    const emailValue = form.email.trim();
    const courseValue = form.course || 'General Spoken English';
    const timeValue = form.time || 'Flexible';
    const modeValue = form.mode || 'Online — Zoom / Meet';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'demo',
          name: nameValue,
          email: emailValue,
          phone: cleanedPhone,
          course: courseValue,
          timeSlot: timeValue,
          learningMode: modeValue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit demo class request.');
      }

      setSubmitted(true);
      toast.success('Our support team will call you back in a while to schedule your free demo class.', 'Demo Request Sent! 🎉', 6000);
    } catch (err: any) {
      console.error('Demo submit error:', err);
      const errMsg = err.message || 'An unexpected error occurred. Please try again.';
      setError(errMsg);
      toast.error(errMsg, 'Submission Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      {/* Modal Card — Large and Spacious */}
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-soft-xl overflow-hidden grid md:grid-cols-12 animate-scale-up max-h-[92vh] overflow-y-auto">
        
        {/* Elegant Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-ink shadow-soft hover:bg-bg-soft hover:scale-105 active:scale-95 transition-all focus:outline-none"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Information & Tutor Image */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-10 text-white relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />
            <div className="absolute bottom-0 -left-12 h-48 w-48 rounded-full bg-primary-400/10 blur-2xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
              <Award className="h-4 w-4 text-secondary" />
              Free Demo Session
            </span>
            <h3 className="font-heading text-3xl font-bold leading-tight">
              Start Speaking English with Confidence
            </h3>
            <ul className="space-y-4 text-sm text-primary-200">
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                45-Minute interactive live class
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                Personal skill evaluation report
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                Custom batch recommendations
              </li>
            </ul>
          </div>

          {/* Tutor image aligned at the bottom */}
          <div className="relative z-10 mt-8 -mx-10 -mb-10 overflow-hidden rounded-t-3xl border-t border-white/10 h-64 lg:h-72">
            <Image
              src="/tutor.png"
              alt="TESCA English Tutor"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Right Side: Demo Booking Form */}
        <div className="col-span-12 md:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
          {submitted ? (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200 shadow-soft">
                <Check className="h-10 w-10" />
              </div>
              <h3 className="font-heading text-3xl font-bold text-ink">
                Demo Request Sent! 🎉
              </h3>
              <p className="mt-4 text-base text-ink-muted max-w-md">
                Our support team will call you back in a while to schedule your free demo class.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary mt-8 px-8 py-3 text-sm font-semibold"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="font-heading text-2xl font-bold text-ink flex items-center gap-2.5">
                  <CalendarCheck className="h-7 w-7 text-primary" />
                  Book Free Demo Class
                </h3>
                <p className="text-sm text-ink-muted mt-1.5">
                  Fill out the form below. No payment or credit card is required.
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3.5 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="modal-name" className="block text-xs font-semibold text-ink mb-1.5">
                  Full Name <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    id="modal-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="modal-phone" className="block text-xs font-semibold text-ink">
                    Phone Number <span className="text-accent">*</span>
                  </label>
                  <span className={`text-[10px] font-semibold transition-colors ${form.phone.length === 10 ? 'text-green-600' : 'text-gray-400'}`}>
                    {form.phone.length} / 10 digits
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setForm((f) => ({ ...f, phone: val }));
                    }}
                    placeholder="Enter 10-digit number"
                    className="w-full rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="modal-email" className="block text-xs font-semibold text-ink mb-1.5">
                  Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="modal-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                </div>
              </div>

              {/* Course Selection */}
              <div className="flex flex-col">
                <span className="block text-xs font-semibold text-ink mb-1.5">
                  Course of Interest <span className="text-gray-400 font-normal">(Optional)</span>
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-full flex items-center justify-between rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink cursor-pointer hover:bg-black/5 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-ink-muted shrink-0" />
                        <span className={form.course ? 'text-ink font-semibold' : 'text-ink-muted/50'}>
                          {form.course || 'Select a course...'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-ink-muted/60" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 max-h-60 overflow-y-auto z-50">
                    <DropdownMenuHighlight>
                      {courses.map((course) => (
                        <DropdownMenuHighlightItem key={course.id}>
                          <DropdownMenuItem onClick={() => setForm((f) => ({ ...f, course: course.title }))}>
                            {course.title}
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                      ))}
                    </DropdownMenuHighlight>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Preferred Time & Mode grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Time Preference */}
                <div className="flex flex-col">
                  <span className="block text-xs font-semibold text-ink mb-1.5">
                    Preferred Time Slot <span className="text-gray-400 font-normal">(Optional)</span>
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="w-full flex items-center justify-between rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink cursor-pointer hover:bg-black/5 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Clock className="h-4 w-4 text-ink-muted shrink-0" />
                          <span className={form.time ? 'text-ink font-semibold' : 'text-ink-muted/50'}>
                            {form.time || 'Select slot...'}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-ink-muted/60" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 max-h-60 overflow-y-auto z-50">
                      <DropdownMenuHighlight>
                        <DropdownMenuHighlightItem>
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, time: 'Morning (9 AM - 12 PM)' }))}>
                            Morning (9 AM - 12 PM)
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                        <DropdownMenuHighlightItem>
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, time: 'Afternoon (12 PM - 4 PM)' }))}>
                            Afternoon (12 PM - 4 PM)
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                        <DropdownMenuHighlightItem>
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, time: 'Evening (4 PM - 8 PM)' }))}>
                            Evening (4 PM - 8 PM)
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                      </DropdownMenuHighlight>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mode Preference */}
                <div className="flex flex-col">
                  <span className="block text-xs font-semibold text-ink mb-1.5">
                    Preferred Learning Mode <span className="text-gray-400 font-normal">(Optional)</span>
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="w-full flex items-center justify-between rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink cursor-pointer hover:bg-black/5 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Laptop className="h-4 w-4 text-ink-muted shrink-0" />
                          <span className={form.mode ? 'text-ink font-semibold' : 'text-ink-muted/50'}>
                            {form.mode || 'Select mode...'}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-ink-muted/60" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 z-50">
                      <DropdownMenuHighlight>
                        <DropdownMenuHighlightItem>
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, mode: 'Online — Zoom / Meet' }))}>
                            Online — Zoom / Meet
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                        <DropdownMenuHighlightItem>
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, mode: 'Online — TESCA Mobile App' }))}>
                            Online — TESCA Mobile App
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                        <DropdownMenuHighlightItem>
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, mode: 'Offline — Classroom (Surat)' }))}>
                            Offline — Classroom (Surat)
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                      </DropdownMenuHighlight>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-warm mt-4 w-full justify-center py-3.5 cursor-pointer disabled:opacity-75"
              >
                {loading ? 'Scheduling...' : 'Schedule My Free Demo'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
