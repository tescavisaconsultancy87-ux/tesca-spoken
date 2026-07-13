'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Key, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

type Step = 'email-request' | 'otp-verify' | 'password-reset' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email-request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Resend countdown timer
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  // Handle email request submit (Step 1)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setStep('otp-verify');
      setCountdown(120); // 120 seconds cooldown
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please check the email and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification (Step 2)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (otp.trim().length !== 6) {
        throw new Error('Please enter a valid 6-digit verification code.');
      }

      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', email, otp: otp.trim() }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid or expired OTP.');
      }

      setStep('password-reset');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code.');
      }

      setCountdown(120); // reset timer
      setOtp(''); // clear previous OTP input
    } catch (err: any) {
      setError(err.message || 'An error occurred. Failed to resend.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset submit (Step 3)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match. Please verify.');
      }

      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reset-password', 
          email, 
          otp: otp.trim(), 
          password 
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Could not update password. Please try again.');
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

      {/* Back button (disabled during loading or on success step) */}
      {step !== 'success' && (
        <button
          onClick={() => {
            if (step === 'otp-verify') setStep('email-request');
            else if (step === 'password-reset') setStep('otp-verify');
            else window.location.href = '/login';
          }}
          disabled={loading}
          className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors z-50 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {step === 'email-request' ? 'Back to Login' : 'Back'}
        </button>
      )}

      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-150 p-8 lg:p-12 animate-scale-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Tesca_logo.png" alt="TESCA Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Action Headers */}
        {step === 'email-request' && (
          <div className="text-center space-y-2 mb-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-800">
              Recover Password
            </h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Enter your registered email address below, and we will send you a 6-digit security code to reset your password.
            </p>
          </div>
        )}

        {step === 'otp-verify' && (
          <div className="text-center space-y-2 mb-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-800">
              Enter Security Code
            </h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              We've sent a 6-digit verification code to <strong className="text-gray-700">{email}</strong>. Enter the code below to verify your account.
            </p>
          </div>
        )}

        {step === 'password-reset' && (
          <div className="text-center space-y-2 mb-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-gray-800">
              Reset Password
            </h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              Your security code has been verified. Choose a strong new password for your account below.
            </p>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-600 mb-6 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Form Render */}
        {step === 'email-request' && (
          <form onSubmit={handleSendOtp} className="space-y-5">
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
                  Sending code...
                </>
              ) : (
                <>
                  Send OTP Code
                  <Send className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'otp-verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="otp" className="block text-xs font-bold text-gray-500">
                Verification Code (6-digit OTP)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // numbers only
                  placeholder="123456"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-xs text-center font-bold tracking-[8px] text-gray-800 focus:bg-white focus:border-primary focus:outline-none transition-all"
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
                  Verifying...
                </>
              ) : (
                <>
                  Verify Security Code
                  <ShieldCheck className="h-4.5 w-4.5" />
                </>
              )}
            </button>

            {/* Resend Cooldown Section */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                className="text-xs font-bold text-primary hover:text-primary-600 disabled:text-gray-400 disabled:no-underline hover:underline transition-all cursor-pointer"
              >
                {countdown > 0 ? `Resend Code in ${countdown}s` : 'Resend Verification Code'}
              </button>
            </div>
          </form>
        )}

        {step === 'password-reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* New Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-gray-500">
                New Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-xs text-gray-800 focus:bg-white focus:border-primary focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 py-3 text-xs text-gray-800 focus:bg-white focus:border-primary focus:outline-none transition-all"
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
                  Updating password...
                </>
              ) : (
                <>
                  Update Password & Login
                </>
              )}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-xs font-semibold text-emerald-800 flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-emerald-600 animate-bounce" />
              <div>
                <p className="text-base font-bold text-emerald-900 mb-1">Password Changed Successfully</p>
                <p className="font-medium text-gray-550 leading-relaxed mt-2">
                  Your identity has been verified, and your password has been securely updated. You can now use your new password to sign in.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full rounded-xl bg-primary hover:bg-primary-600 font-bold text-xs py-3.5 transition-all text-white shadow-soft"
            >
              Go to Login Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
