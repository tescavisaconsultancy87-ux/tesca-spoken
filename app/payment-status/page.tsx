'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export default function PaymentStatusPage() {
  const [searchType, setSearchType] = useState<'email' | 'paymentId'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/checkout/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [searchType === 'email' ? 'email' : 'paymentId']: searchValue.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Unable to check payment status. Please try again.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container-x">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-md border border-orange-100 inline-block mb-4">
              Payment Verification
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Check Your Payment Status
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enter your email address or Razorpay Payment ID to verify your payment and enrollment status.
              If your payment was successful, you should have received a confirmation email with your login credentials.
            </p>
          </div>

          {/* Search Card */}
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft">
              {/* Search type toggle */}
              <div className="flex gap-2 p-1 bg-gray-50 border border-gray-100 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => { setSearchType('email'); setSearchValue(''); setResult(null); setError(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    searchType === 'email' ? 'bg-primary text-white shadow-soft' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Search by Email
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchType('paymentId'); setSearchValue(''); setResult(null); setError(null); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    searchType === 'paymentId' ? 'bg-primary text-white shadow-soft' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Search by Payment ID
                </button>
              </div>

              {/* Search form */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">
                    {searchType === 'email' ? 'Email Address' : 'Razorpay Payment ID'}
                  </label>
                  <input
                    type={searchType === 'email' ? 'email' : 'text'}
                    placeholder={searchType === 'email' ? 'e.g. john@example.com' : 'e.g. pay_XXXXXXXXXXXXXXX'}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-600 shadow-soft flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Check Payment Status
                    </>
                  )}
                </button>
              </form>

              {/* Error */}
              {error && (
                <div className="mt-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-800">Error</p>
                    <p className="text-[11px] text-rose-700 leading-relaxed mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Not Found */}
              {result && !result.found && (
                <div className="mt-5 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-800">No Payment Found</p>
                    <p className="text-xs text-amber-700 leading-relaxed mt-1">{result.message}</p>
                  </div>
                  <a
                    href="https://wa.me/918488805888?text=Hi%20TESCA,%20I%20made%20a%20payment%20but%20it%27s%20not%20showing%20up.%20Please%20help."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Contact Support on WhatsApp
                  </a>
                </div>
              )}

              {/* Payment Found */}
              {result && result.found && (
                <div className="mt-5 space-y-4">
                  {/* Enrollment status banner */}
                  {result.enrollmentActive ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-800">Enrollment Active ✓</p>
                        <p className="text-[11px] text-green-700">Your course enrollment is active. You can log in to access your course materials.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-800">Enrollment Pending</p>
                        <p className="text-[11px] text-amber-700">Payment was received but enrollment is being processed. If this persists, please contact us.</p>
                      </div>
                    </div>
                  )}

                  {/* Payment records */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment History</p>
                    {result.payments.map((p: any, i: number) => (
                      <div key={i} className="border border-gray-100 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-gray-800">₹{Number(p.amount).toLocaleString('en-IN')}</span>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                            p.status === 'success'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : p.status === 'failed'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {p.status === 'success' ? '✓ Success' : p.status === 'failed' ? '✗ Failed' : '⏳ Pending'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                          <div><span className="text-gray-400 font-medium">Name:</span> <span className="text-gray-700">{p.name}</span></div>
                          <div><span className="text-gray-400 font-medium">Date:</span> <span className="text-gray-700">{p.date}</span></div>
                          <div><span className="text-gray-400 font-medium">Method:</span> <span className="text-gray-700">{p.method}</span></div>
                          <div><span className="text-gray-400 font-medium">ID:</span> <span className="text-gray-700 font-mono text-[10px]">{p.paymentId}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {result.enrollmentActive && (
                      <a
                        href="/login"
                        className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-600 transition-colors"
                      >
                        Go to Student Portal
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <a
                      href="https://wa.me/918488805888?text=Hi%20TESCA,%20I%20need%20help%20with%20my%20payment%20status."
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${result.enrollmentActive ? '' : 'flex-1'} py-2.5 px-4 rounded-xl border border-gray-150 text-gray-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Need Help?
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
