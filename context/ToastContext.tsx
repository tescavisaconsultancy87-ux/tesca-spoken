'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: { message: string; title?: string; type?: ToastType; duration?: number }) => void;
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, title, type = 'info', duration = 4500 }: { message: string; title?: string; type?: ToastType; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      setToasts((prev) => [...prev.slice(-4), { id, message, title, type, duration }]);
    },
    []
  );

  const toastHelpers = {
    success: (message: string, title?: string, duration?: number) => showToast({ message, title, type: 'success', duration }),
    error: (message: string, title?: string, duration?: number) => showToast({ message, title, type: 'error', duration }),
    info: (message: string, title?: string, duration?: number) => showToast({ message, title, type: 'info', duration }),
    warning: (message: string, title?: string, duration?: number) => showToast({ message, title, type: 'warning', duration }),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast: toastHelpers, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/* ─── Toast Container Component ─── */
function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-4 sm:right-6 z-[99999] flex flex-col gap-3 max-w-[92vw] sm:max-w-md w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

/* ─── Individual Premium Toast Card Component ─── */
function ToastCard({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration = toast.duration || 4500;

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPct);
    }, 30);

    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [toast.id, duration, isPaused, onRemove]);

  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 border-emerald-500/30',
      progressBg: 'bg-emerald-400',
      glow: 'shadow-[0_12px_32px_rgba(16,185,129,0.22)]',
      defaultTitle: 'Success',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 border-rose-500/30',
      progressBg: 'bg-rose-400',
      glow: 'shadow-[0_12px_32px_rgba(244,63,94,0.22)]',
      defaultTitle: 'Attention',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-500/30',
      progressBg: 'bg-amber-400',
      glow: 'shadow-[0_12px_32px_rgba(245,158,11,0.22)]',
      defaultTitle: 'Notice',
    },
    info: {
      icon: Info,
      iconColor: 'text-teal-400',
      badgeBg: 'bg-teal-500/20 border-teal-500/30',
      progressBg: 'bg-teal-400',
      glow: 'shadow-[0_12px_32px_rgba(20,184,166,0.22)]',
      defaultTitle: 'Information',
    },
  }[toast.type];

  const IconComponent = config.icon;
  const titleText = toast.title || config.defaultTitle;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        pointer-events-auto relative overflow-hidden rounded-2xl
        bg-[#0b1b22]/95 backdrop-blur-xl border border-white/15
        text-white p-4 transition-all duration-300 transform animate-scale-up
        ${config.glow} flex items-start gap-3.5 group hover:scale-[1.01]
      `}
    >
      {/* Icon Badge */}
      <div className={`p-2 rounded-xl border ${config.badgeBg} shrink-0 mt-0.5`}>
        <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-grow pr-6 space-y-0.5">
        <h4 className="text-xs font-bold tracking-wide text-white flex items-center gap-1.5">
          {titleText}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Dismiss message"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className={`h-full ${config.progressBg} transition-all ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
