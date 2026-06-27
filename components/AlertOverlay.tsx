'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from '@/components/animate-ui/primitives/base/alert-dialog';
import { Sparkles } from 'lucide-react';

export default function AlertOverlay() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Save native alert
    const nativeAlert = window.alert;

    // Override alert globally
    window.alert = (msg: string) => {
      setMessage(msg);
    };

    return () => {
      window.alert = nativeAlert;
    };
  }, []);

  return (
    <AlertDialog open={message !== null} onOpenChange={(open) => { if (!open) setMessage(null); }}>
      <AlertDialogPortal>
        <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <AlertDialogPopup
          from="center"
          className="sm:max-w-[380px] border bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center"
        >
          <AlertDialogHeader className="flex flex-col items-center text-center w-full">
            {/* Animated Sparkles Icon Container */}
            <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-4 border border-primary-100 shadow-soft">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            
            <AlertDialogTitle className="text-base font-bold text-gray-800">TESCA Learning</AlertDialogTitle>
            
            <AlertDialogDescription className="text-xs text-gray-500 mt-2.5 leading-relaxed">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="w-full mt-6">
            <AlertDialogClose className="w-full bg-primary text-white py-2.5 px-5 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary-600 transition-all cursor-pointer shadow-soft">
              Okay
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}


