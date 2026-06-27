'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMock = searchParams.get('mock') === 'true';

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      if (supabase && !isMock) {
        const { error: resetError } = await supabase.auth.updateUser({
          password: form.newPassword,
        });
        if (resetError) throw resetError;
      } else {
        // Dev Sandbox Mock Logic
        console.log('[Mock ResetPassword] Password reset succeeded.');
        await new Promise((r) => setTimeout(r, 1200));
      }

      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please check your link and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-150 p-8 lg:p-12 animate-scale-up">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/Tesca_logo.png" alt="TESCA Logo" className="h-10 w-auto object-contain" />
      </div>

      <div className="text-center space-y-2 mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-800">
          Reset Password
        </h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Please enter and confirm your new preferred password below to restore access to your account.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-600 mb-6 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-xs font-semibold text-emerald-800 flex flex-col items-center gap-3 text-center">
          <CheckCircle className="h-10 w-10 text-emerald-600 animate-bounce" />
          <div>
            <p className="text-sm font-bold text-emerald-950 mb-1">Password Reset Successfully</p>
            <p className="font-medium text-gray-550 leading-relaxed">
              Your password has been changed. You will now be redirected to the login screen.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500">
              New Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.newPassword}
                onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))}
                placeholder="Enter new password (min 8 chars)"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-xs text-gray-800 focus:bg-white focus:border-primary focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-xs text-gray-800 focus:bg-white focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary hover:bg-primary-600 active:scale-98 font-bold text-xs py-3.5 cursor-pointer text-white flex items-center justify-center gap-2 transition-all mt-6 shadow-soft border border-primary/20 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Resetting password...
              </>
            ) : (
              'Reset Password & Login'
            )}
          </button>
        </form>
      )}

      {/* Back to Login link */}
      <div className="text-center mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5f5] via-[#f0fafa] to-white p-4 lg:p-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <Suspense fallback={
        <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-150 p-8 lg:p-12 animate-scale-up text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary mx-auto" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Loading reset page...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
