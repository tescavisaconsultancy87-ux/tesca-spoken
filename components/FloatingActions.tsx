'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, HelpCircle, X, ArrowRight, Phone, CalendarCheck } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [isConfusedPopupOpen, setIsConfusedPopupOpen] = useState(false);
  const { openModal } = useDemoModal();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Add safe padding to body on mobile to prevent content overlap with sticky bottom bar
    const style = document.createElement('style');
    style.id = 'sticky-bottom-bar-spacer';
    style.innerHTML = `
      @media (max-width: 767px) {
        body {
          padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('scroll', onScroll);
      const el = document.getElementById('sticky-bottom-bar-spacer');
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    // Check if popup was already shown or user interacted in this/past sessions
    const isShown = localStorage.getItem('tesca_popup_shown') === 'true';
    const hasInteracted = localStorage.getItem('tesca_interacted') === 'true';

    if (isShown || hasInteracted) return;

    // Start 30 seconds timer
    const timer = setTimeout(() => {
      const stillInteracted = localStorage.getItem('tesca_interacted') === 'true';
      if (!stillInteracted) {
        setIsConfusedPopupOpen(true);
        localStorage.setItem('tesca_popup_shown', 'true');
      }
    }, 30000);

    // Global listener for interactions
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.innerText?.toLowerCase() || '';
      
      // Determine if they clicked demo booking or course selection buttons
      const isInteraction =
        text.includes('demo') ||
        text.includes('course') ||
        text.includes('enroll') ||
        text.includes('counselling') ||
        target.closest('a[href*="demo"]') ||
        target.closest('button[onClick*="openModal"]') ||
        target.closest('a[href*="courses"]');

      if (isInteraction) {
        localStorage.setItem('tesca_interacted', 'true');
        clearTimeout(timer);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return (
    <>
      {/* Desktop Floating Actions */}
      <div className="hidden md:flex fixed bottom-5 right-5 z-40 flex-col gap-3 lg:bottom-8 lg:right-8">
        {/* Scroll to top */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-primary shadow-soft-lg transition-all duration-500 hover:bg-primary hover:text-white ${
            showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>

        {/* WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)] lg:h-[60px] lg:w-[60px]"
          aria-label="Contact us on WhatsApp"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          <svg
            viewBox="0 0 175.216 175.552"
            className="relative h-7 w-7 lg:h-8 lg:w-8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="M87.184 0C39.04 0 0 39.04 0 87.184c0 16.4 4.544 31.72 12.44 44.84L0 175.552l45.04-11.84c12.56 6.88 26.96 10.84 42.144 10.84 48.144 0 87.184-39.04 87.184-87.184S135.328 0 87.184 0zm0 160.208c-14.64 0-28.24-4.32-39.68-11.72l-2.84-1.68-29.44 7.72 7.84-28.64-1.84-2.92c-8.12-12.92-12.4-27.84-12.4-43.16 0-40.28 32.76-73.04 73.04-73.04 40.28 0 73.04 32.76 73.04 73.04-.72 40.28-33.48 73.04-73.72 73.04v-.6z"
            />
            <path
              fill="#ffffff"
              d="M126.82 105.4c-2.16-1.08-12.84-6.32-14.82-7.04-1.98-.72-3.42-1.08-4.86 1.08-1.44 2.16-5.58 7.04-6.84 8.46-1.26 1.44-2.52 1.62-4.68.54-2.16-1.08-9.12-3.36-17.4-10.74-6.42-5.74-10.74-12.84-12-15-1.26-2.16-.12-3.34 .96-4.42 .96-1.08 2.16-2.52 3.24-3.78 1.08-1.26 1.44-2.16 2.16-3.6.72-1.44.36-2.7-.18-3.78-.54-1.08-4.86-11.7-6.66-16.02-1.76-4.2-3.54-3.6-4.86-3.66-1.26-.06-2.7-.06-4.14-.06-1.44 0-3.78.54-5.76 2.7-1.98 2.16-7.56 7.38-7.56 18s7.74 20.88 8.82 22.32c1.08 1.44 15.24 23.28 36.9 32.64 5.16 2.22 9.18 3.54 12.32 4.56 5.18 1.62 9.9 1.38 13.62.84 4.14-.6 12.84-5.22 14.64-10.26 1.8-5.04 1.8-9.36 1.26-10.26-.54-.9-1.98-1.44-4.14-2.52z"
            />
          </svg>
          <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
            Chat with us on WhatsApp
          </span>
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between gap-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Call Us */}
        <a
          href="tel:+919824152731"
          className="flex flex-col items-center gap-1 text-[#334155] hover:text-slate-800 transition-colors"
        >
          <Phone className="h-5 w-5 stroke-[2] text-[#334155]" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#334155]">Call Us</span>
        </a>

        {/* WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-[#25D366] hover:text-green-600 transition-colors"
        >
          <svg
            viewBox="0 0 175.216 175.552"
            className="h-5 w-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M87.184 0C39.04 0 0 39.04 0 87.184c0 16.4 4.544 31.72 12.44 44.84L0 175.552l45.04-11.84c12.56 6.88 26.96 10.84 42.144 10.84 48.144 0 87.184-39.04 87.184-87.184S135.328 0 87.184 0zm0 160.208c-14.64 0-28.24-4.32-39.68-11.72l-2.84-1.68-29.44 7.72 7.84-28.64-1.84-2.92c-8.12-12.92-12.4-27.84-12.4-43.16 0-40.28 32.76-73.04 73.04-73.04 40.28 0 73.04 32.76 73.04 73.04-.72 40.28-33.48 73.04-73.72 73.04v-.6z" />
            <path d="M126.82 105.4c-2.16-1.08-12.84-6.32-14.82-7.04-1.98-.72-3.42-1.08-4.86 1.08-1.44 2.16-5.58 7.04-6.84 8.46-1.26 1.44-2.52 1.62-4.68.54-2.16-1.08-9.12-3.36-17.4-10.74-6.42-5.74-10.74-12.84-12-15-1.26-2.16-.12-3.34 .96-4.42 .96-1.08 2.16-2.52 3.24-3.78 1.08-1.26 1.44-2.16 2.16-3.6.72-1.44.36-2.7-.18-3.78-.54-1.08-4.86-11.7-6.66-16.02-1.76-4.2-3.54-3.6-4.86-3.66-1.26-.06-2.7-.06-4.14-.06-1.44 0-3.78.54-5.76 2.7-1.98 2.16-7.56 7.38-7.56 18s7.74 20.88 8.82 22.32c1.08 1.44 15.24 23.28 36.9 32.64 5.16 2.22 9.18 3.54 12.32 4.56 5.18 1.62 9.9 1.38 13.62.84 4.14-.6 12.84-5.22 14.64-10.26 1.8-5.04 1.8-9.36 1.26-10.26-.54-.9-1.98-1.44-4.14-2.52z" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-wider">WhatsApp</span>
        </a>

        {/* Book Call Button */}
        <button
          onClick={openModal}
          className="flex-grow flex items-center justify-center gap-2 bg-[#067779] text-white py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all hover:bg-[#056365]"
        >
          <CalendarCheck className="h-4.5 w-4.5 text-white" />
          <span>Book Call</span>
        </button>
      </div>

      {/* Engagement Popup Modal */}
      {isConfusedPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-soft-xl border border-black/5 p-6 md:p-8 animate-scale-up text-center space-y-6">
            
            {/* Close button */}
            <button
              onClick={() => setIsConfusedPopupOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Glowing Icon */}
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-50 text-primary flex items-center justify-center border border-primary-100 shadow-soft animate-pulse">
              <HelpCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold text-gray-800 leading-snug">
                Still confused about where to start? 🤔
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                No worries! Speak to our expert coaches for a free counselling and demo session. We will evaluate your current English level and recommend the perfect path.
              </p>
            </div>

            {/* Benefits List */}
            <div className="bg-bg-soft rounded-2xl p-4 text-left space-y-2.5 text-xs font-semibold text-gray-600 border border-black/5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span>Free 45-Minute Live Interactive Class</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span>Personalized Level Evaluation Report</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span>Flexible Batches (Morning / Evening)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  setIsConfusedPopupOpen(false);
                  openModal();
                }}
                className="w-full btn-warm justify-center py-3 text-xs font-bold shadow-soft transition-transform hover:scale-[1.02] cursor-pointer"
              >
                Book My Free Demo
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsConfusedPopupOpen(false);
                  const el = document.getElementById('courses');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.href = '/courses';
                }}
                className="w-full py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Choose English Course
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
