'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/animate-ui/components/radix/alert-dialog';
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
      <AlertDialogContent from="center" className="sm:max-w-[380px]">
        <AlertDialogHeader className="flex flex-col items-center text-center mt-2">
          {/* Animated Sparkles Icon Container */}
          <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mb-4 border border-primary-100 shadow-soft">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          
          <AlertDialogTitle>TESCA Learning</AlertDialogTitle>
          
          <AlertDialogDescription className="mt-2.5">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="w-full flex">
          <AlertDialogAction className="w-full">Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

