'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PromoFormProps {
  popupId: number;
  popupTitle: string;
  requiredFields: string[];
}

export default function PromoForm({ popupId, popupTitle, requiredFields }: PromoFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isNameReq = requiredFields.includes('name');
  const isPhoneReq = requiredFields.includes('phone');
  const isEmailReq = requiredFields.includes('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'popup',
          name,
          phone: phone || undefined,
          email: email || undefined,
          popupId,
          popupTitle,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit registration.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6 animate-scale-up">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5 border border-emerald-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="animate-bounce"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-800">Registration Successful!</h2>
        <p className="text-slate-500 text-xs mt-2.5 leading-relaxed max-w-sm font-sans font-normal">
          Thank you for registering. Our student coordinator will contact you shortly to review your profile.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
        >
          Go Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-600" autoComplete="off">
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-[10px] text-slate-500 uppercase tracking-wide">
          Full Name {isNameReq ? '*' : '(Optional)'}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={isNameReq}
          className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-850 focus:outline-none focus:ring-1 focus:ring-primary font-sans font-normal"
          placeholder="e.g. John Doe"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-[10px] text-slate-500 uppercase tracking-wide">
          Mobile Number {isPhoneReq ? '*' : '(Optional)'}
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required={isPhoneReq}
          className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-855 focus:outline-none focus:ring-1 focus:ring-primary font-sans font-normal"
          placeholder="e.g. +91 99999 99999"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-[10px] text-slate-500 uppercase tracking-wide">
          Email Address {isEmailReq ? '*' : '(Optional)'}
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={isEmailReq}
          className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-860 focus:outline-none focus:ring-1 focus:ring-primary font-sans font-normal"
          placeholder="e.g. johndoe@gmail.com"
        />
      </div>

      <div className="pt-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Registration</span>
          )}
        </button>
      </div>
    </form>
  );
}
