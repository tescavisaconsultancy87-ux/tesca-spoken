'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(form.username, form.password);
    
    if (result.success) {
      if (result.role !== 'admin') {
        try {
          const settings = await db.getSystemSettings();
          if (settings.maintenanceMode) {
            router.push('/maintenance');
            return;
          }
        } catch (err) {
          console.error('[Login Page] Maintenance gate check failed:', err);
        }
      }

      setLoading(false);
      if (result.needsPasswordChange) {
        router.push('/change-password');
      } else if (result.role === 'admin') {
        router.push('/admin');
      } else if (result.role === 'tutor') {
        router.push('/tutor');
      } else {
        router.push('/student');
      }
    } else {
      setLoading(false);
      setError(result.error || 'Invalid credentials. Please try again.');
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
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors z-50 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Main Card Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden grid md:grid-cols-12 min-h-[550px] animate-scale-up">
        
        {/* Left Column: Illustration (Light bg) */}
        <div className="hidden md:flex md:col-span-6 bg-gradient-to-br from-[#f0fafa] to-white p-10 flex-col justify-between relative overflow-hidden border-r border-gray-100">
          
          {/* Logo */}
          <div className="relative z-10">
            <Link href="/" className="group flex items-center">
              <img src="/Tesca_logo.png" alt="TESCA Logo" className="h-8 w-auto object-contain" />
            </Link>
          </div>

          {/* AI generated Illustration */}
          <div className="my-auto max-w-[280px] mx-auto z-10 flex flex-col items-center">
            <img
              src="/login_illustration.png"
              alt="English Learning Illustration"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Footer Copyright */}
          <div className="text-[10px] text-gray-400 relative z-10">
            <p>© 2026 TESCA Spoken English.</p>
            <p className="opacity-75">All rights reserved.</p>
          </div>
        </div>

        {/* Right Column: Form (Teal bg) */}
        <div className="col-span-12 md:col-span-6 bg-[#0b3336] p-8 lg:p-12 flex flex-col justify-between text-white relative">
          {/* Decorative subtle glows */}
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/5 blur-xl" />

          <div className="my-auto space-y-6 relative z-10">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight">Login</h1>
              <p className="text-xs text-primary-200 mt-1">
                Enter your credentials to access your student dashboard.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/20 border border-red-500/30 p-3.5 text-xs font-semibold text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-xs font-semibold text-primary-200">
                  Username or Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="username"
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    placeholder="Enter your username"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-xs font-semibold text-primary-200">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[10px] font-semibold text-secondary hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-xs text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary hover:bg-primary-600 active:scale-98 font-bold text-xs py-3.5 cursor-pointer flex items-center justify-center gap-2 transition-all mt-6 shadow-soft border border-white/10 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer contact info */}
          <div className="text-[10px] text-primary-300 border-t border-white/5 pt-5 mt-6 relative z-10 flex justify-between items-center">
            <span>Have a problem? Contact us at</span>
            <a href="mailto:tescavisaconsultancy87@gmail.com" className="font-semibold text-secondary hover:underline">
              tescavisaconsultancy87@gmail.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}