'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (supabase) {
        // Verify email registration in profiles first
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (profileError || !profile) {
          throw new Error('This email address is not registered in our system.');
        }

        const origin = window.location.origin;
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/login`,
        });
        if (resetError) throw resetError;
      } else {
        // Dev Sandbox Mock Logic
        console.log('[Mock ForgotPassword] Sending mock recovery email to:', email);
        await new Promise((r) => setTimeout(r, 1000));
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email. Please verify the email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5f5] via-[#f0fafa] to-white p-4 lg:p-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      {/* Back button */}
      <Link
        href="/login"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors z-50 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm animate-fade-in"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-150 p-8 lg:p-12 animate-scale-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Tesca_logo.png" alt="TESCA Logo" className="h-10 w-auto object-contain" />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-800">
            Recover Password
          </h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Enter your registered email address below, and we will send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-600 mb-6 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6 text-center">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-xs font-semibold text-emerald-800 flex flex-col items-center gap-3">
              <CheckCircle className="h-10 w-10 text-emerald-600 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-emerald-900 mb-1">Check your Inbox</p>
                <p className="font-medium text-gray-550 leading-relaxed">
                  We have sent a secure password reset link to <strong className="text-emerald-950">{email}</strong>.
                  Please check your spam or promotional folders if you don't receive it within a few minutes.
                </p>
              </div>
            </div>

            {!supabase && (
              <div className="p-4 border border-orange-100 bg-orange-50/50 rounded-2xl space-y-2.5">
                <p className="text-[11px] font-bold text-orange-850 uppercase tracking-wider">Dev Sandbox Notice</p>
                <p className="text-xs text-gray-500">
                  Supabase client is not configured. To test the rest of the flow in the developer sandbox, you can jump directly to the reset screen.
                </p>
                <Link
                  href="/reset-password?mock=true"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-600 hover:underline"
                >
                  Go directly to Reset Password screen &rarr;
                </Link>
              </div>
            )}

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-bold text-xs py-3.5 transition-all text-gray-700"
            >
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-gray-500">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-xs text-gray-800 focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary hover:bg-primary-600 active:scale-98 font-bold text-xs py-3.5 cursor-pointer text-white flex items-center justify-center gap-2 transition-all mt-6 shadow-soft border border-primary/20 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending email...
                </>
              ) : (
                <>
                  Send Recovery Link
                  <Send className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
