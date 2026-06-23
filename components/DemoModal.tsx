'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
  DropdownMenuItem,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';

interface DemoModalProps {
  onClose: () => void;
}

export default function DemoModal({ onClose }: DemoModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    time: '',
    mode: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.time || !form.mode) {
      setError('Please select both a preferred time slot and learning mode.');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      {/* Modal Card — Large and Spacious */}
      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-soft-xl overflow-hidden grid md:grid-cols-12 animate-scale-up">
        
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
            <img
              src="/tutor.png"
              alt="TESCA English Tutor"
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
                Our support team will contact you within 24 hours to schedule your free demo class on your preferred time.
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
                <label htmlFor="modal-phone" className="block text-xs font-semibold text-ink mb-1.5">
                  Phone Number <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="modal-email" className="block text-xs font-semibold text-ink mb-1.5">
                  Email Address <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-black/10 bg-bg-soft pl-10 pr-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                  />
                </div>
              </div>

              {/* Preferred Time & Mode grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Time Preference */}
                <div className="flex flex-col">
                  <span className="block text-xs font-semibold text-ink mb-1.5">
                    Preferred Time Slot <span className="text-accent">*</span>
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
                    Preferred Learning Mode <span className="text-accent">*</span>
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
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, mode: 'Online Zoom/Meet' }))}>
                            Online Zoom/Meet
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                        <DropdownMenuHighlightItem>
                          <DropdownMenuItem onClick={() => setForm(f => ({ ...f, mode: 'Offline Classroom (MG Road)' }))}>
                            Offline Classroom (MG Road)
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
