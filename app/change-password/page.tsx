'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export default function ChangePasswordPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0fafa]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-450 uppercase tracking-widest mt-3">Loading context...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
      if (supabase) {
        // 1. Update the password in Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
          password: form.newPassword,
        });
        if (authError) throw authError;

        // 2. Set needs_password_change to false in profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ needs_password_change: false })
          .eq('id', user.id);
        if (profileError) {
          console.warn('[ChangePassword] Failed to update profile column (it might not exist in this database schema yet):', profileError.message);
        }

        // 3. Refresh user profile in Auth Context
        await refreshUser();
      } else {
        // Dev Sandbox Mock Logic
        console.log('[Mock ChangePassword] Updating password in mock session');
        const updatedProfile = { ...user, needsPasswordChange: false };
        sessionStorage.setItem('tesca_dev_session', JSON.stringify(updatedProfile));
        await refreshUser();
      }

      setSuccess(true);
      
      // Delay redirect slightly so user sees success state
      setTimeout(() => {
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'tutor') {
          router.push('/tutor');
        } else {
          router.push('/student');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5f5] via-[#f0fafa] to-white p-4 lg:p-8 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-150 p-8 lg:p-12 animate-scale-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Tesca_logo.png" alt="TESCA Logo" className="h-10 w-auto object-contain" />
        </div>

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-full bg-orange-100 text-secondary mb-2 animate-bounce">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-800">
            Secure Your Account
          </h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You are logging in with a temporary pre-generated password. Please set a new preferred password to continue.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-600 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-emerald-55 border border-emerald-200 p-4 text-xs font-semibold text-emerald-700 mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            Password changed successfully! Redirecting to your dashboard...
          </div>
        )}

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
                disabled={success}
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
              Confirm New Password
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
                disabled={success}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full rounded-xl bg-primary hover:bg-primary-600 active:scale-98 font-bold text-xs py-3.5 cursor-pointer text-white flex items-center justify-center gap-2 transition-all mt-6 shadow-soft border border-primary/20 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Updating password...
              </>
            ) : (
              <>
                Update Password & Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
