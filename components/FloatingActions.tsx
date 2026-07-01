'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, HelpCircle, X, ArrowRight } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [isConfusedPopupOpen, setIsConfusedPopupOpen] = useState(false);
  const { openModal } = useDemoModal();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 lg:bottom-8 lg:right-8">
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
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-soft-lg transition-all duration-300 hover:scale-105 hover:bg-green-600 lg:h-16 lg:w-16"
          aria-label="Contact us on WhatsApp"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-30" />
          <svg
            viewBox="0 0 24 24"
            className="relative h-7 w-7 lg:h-8 lg:w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.507 0 9.961-4.45 9.964-9.943.001-2.661-1.019-5.163-2.872-7.015A9.86 9.86 0 0 0 11.3-.008c-5.513 0-10.019 4.504-10.022 9.998-.001 1.73.454 3.42 1.316 4.921L1.6 20.87l6.096-1.599-1.049-.117zM17.9 14.2c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-1.12-.56-1.95-1.03-2.72-1.7-1.15-1-.93-1.63-.6-2.15.18-.3.35-.45.5-.6.13-.15.18-.25.28-.43.1-.18.05-.33-.02-.48-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.5-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.8.38-.28.3-1.07 1.05-1.07 2.56s1.1 2.97 1.25 3.17c.15.2 2.16 3.29 5.23 4.61.73.31 1.3.5 1.74.64.74.23 1.4.2 1.93.12.59-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.13-.28-.2-.58-.35z" />
          </svg>
          <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
            Chat with us on WhatsApp
          </span>
        </a>
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
