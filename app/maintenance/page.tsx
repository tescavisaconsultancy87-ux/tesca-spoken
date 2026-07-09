'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Hammer, Mail, Phone, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';

export default function MaintenancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const settings = await db.getSystemSettings();
        // If maintenance mode is off, or the user is logged in as an admin, redirect away from here
        if (!settings.maintenanceMode || (user && user.role === 'admin')) {
          router.push('/');
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading config in maintenance page', err);
        setLoading(false);
      }
    }
    checkMaintenance();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Verifying configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5f5] via-[#f0fafa] to-white p-4 lg:p-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-300/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-orange-200/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-soft-xl border border-black/5 overflow-hidden p-8 sm:p-12 text-center space-y-8 flex flex-col items-center">
        
        {/* Animated Icon Box */}
        <div className="h-20 w-20 rounded-full bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shadow-soft animate-bounce">
          <Hammer className="h-9 w-9 text-primary" />
        </div>

        {/* Content text */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1 bg-secondary/15 text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-secondary/20">
            System Upgrade
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            Dashboard is Temporarily Under Maintenance
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            We are performing scheduled improvements to optimize your learning portal. 
            Don't worry — all your course progress, class schedules, and profile data are completely safe and will be accessible shortly.
          </p>
        </div>

        {/* Contact info links */}
        <div className="w-full border-t border-black/5 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="mailto:tescavisaconsultancy87@gmail.com"
            className="flex items-center gap-3.5 rounded-2xl border border-black/5 bg-bg-soft p-4 text-left transition-all hover:border-primary/20 hover:shadow-soft group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Mail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-ink text-xs">Email Support</p>
              <p className="text-[11px] text-ink-muted truncate">tescavisaconsultancy87@gmail.com</p>
            </div>
          </a>

          <a
            href="tel:+919824152731"
            className="flex items-center gap-3.5 rounded-2xl border border-black/5 bg-bg-soft p-4 text-left transition-all hover:border-primary/20 hover:shadow-soft group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Phone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-ink text-xs">Call Support Team</p>
              <p className="text-[11px] text-ink-muted truncate">+91 98241 52731</p>
            </div>
          </a>
        </div>

        {/* Action button */}
        <div className="w-full pt-4">
          <Link
            href="/"
            className="btn-primary w-full sm:w-auto justify-center px-8 py-3.5 font-bold text-xs"
          >
            Back to Home page
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
