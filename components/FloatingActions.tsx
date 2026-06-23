'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/data/content';

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
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
        {/* Tooltip */}
        <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
          Chat with us on WhatsApp
        </span>
      </a>
    </div>
  );
}
