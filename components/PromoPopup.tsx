'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PopupSetting {
  id: number;
  is_active: boolean;
  image_url: string;
  title: string;
  subtitle: string;
  delay_seconds: number;
  button_text: string;
  link_url: string;
  lead_capture_enabled: boolean;
  required_fields: string[];
}

export default function PromoPopup() {
  const [popups, setPopups] = useState<PopupSetting[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if user has closed the popup in this session
    const isTestMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('test-popup') === 'true';
    const isClosed = sessionStorage.getItem('promo_popup_closed');

    if (isClosed === 'true' && !isTestMode) return;

    async function fetchPopups() {
      try {
        const response = await fetch('/api/popup-settings');
        if (!response.ok) return;
        const data = await response.json();

        let activePopups = data;

        // Mock data in test mode if database is empty
        if (isTestMode && (!Array.isArray(activePopups) || activePopups.length === 0)) {
          activePopups = [
            {
              id: 999,
              title: 'Welcome to TESCA!',
              subtitle: 'Visual validation test popup.',
              image_url: '/og-image.jpg',
              button_text: 'Enquire Now',
              delay_seconds: 2,
              is_active: true,
              link_url: '',
              lead_capture_enabled: true,
              required_fields: ['name', 'phone'],
            },
          ];
        }

        if (!Array.isArray(activePopups) || activePopups.length === 0) return;

        setPopups(activePopups);

        // Schedule showing the popup based on delay of first slide
        const delayMs = (isTestMode ? 1 : activePopups[0].delay_seconds || 5) * 1000;
        const timer = setTimeout(() => {
          setVisible(true);
        }, delayMs);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Failed to load promo popups:', err);
      }
    }

    fetchPopups();
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVisible(false);
    const isTestMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('test-popup') === 'true';
    if (!isTestMode) {
      sessionStorage.setItem('promo_popup_closed', 'true');
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? popups.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === popups.length - 1 ? 0 : prev + 1));
  };

  const handleSlideClick = () => {
    const currentPopup = popups[currentIdx];
    if (!currentPopup) return;

    handleClose();

    if (currentPopup.link_url) {
      // External or custom link redirect
      window.location.href = currentPopup.link_url;
    } else {
      // Dedicated registration landing page
      router.push(`/promo/${currentPopup.id}`);
    }
  };

  if (!visible || popups.length === 0) return null;

  const currentPopup = popups[currentIdx];

  return (
    <div
      onClick={() => handleClose()}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all duration-300 animate-scale-up"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => handleClose()}
          className="absolute top-4 right-4 z-50 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-md transition-all cursor-pointer hover:scale-105"
          aria-label="Close popup"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        {/* Navigation Arrows */}
        {popups.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full shadow-lg transition-all cursor-pointer hover:scale-105 border border-slate-100/80"
              aria-label="Previous popup"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full shadow-lg transition-all cursor-pointer hover:scale-105 border border-slate-100/80"
              aria-label="Next popup"
            >
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Slides/Flyer Image Container */}
        <div
          onClick={handleSlideClick}
          className="relative w-full aspect-square bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center select-none group"
        >
          <img
            src={currentPopup.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none"
          />
          <img
            src={currentPopup.image_url}
            alt={currentPopup.title}
            className="absolute inset-0 m-auto max-w-full max-h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 pt-12 text-white text-left flex flex-col justify-end">
            <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-[#F97823] bg-[#F97823]/10 border border-[#F97823]/30 px-2 py-0.5 rounded mb-2 self-start">
              Special Event Offer
            </span>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight leading-snug">
              {currentPopup.title}
            </h3>
            {currentPopup.subtitle && (
              <p className="text-[10px] sm:text-xs text-gray-250 mt-1 line-clamp-2 font-medium opacity-90 leading-normal">
                {currentPopup.subtitle}
              </p>
            )}
            <button
              type="button"
              className="mt-4 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer hover:bg-primary-600 transition-colors w-full text-center"
            >
              {currentPopup.button_text || 'Learn More'}
            </button>
          </div>
        </div>

        {/* Dots Indicators */}
        {popups.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {popups.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
