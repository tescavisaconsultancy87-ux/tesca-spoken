'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, Megaphone, Eye } from 'lucide-react';
import { db } from '@/lib/db';

function CountdownTimerPreview({ expiryType, fixedExpiry }: { expiryType: string; fixedExpiry: string }) {
  const getTimeLeft = () => {
    const now = new Date();
    let end = new Date();
    if (expiryType === 'fixed' && fixedExpiry) {
      const parsedEnd = new Date(fixedExpiry);
      if (!isNaN(parsedEnd.getTime())) {
        end = parsedEnd;
      } else {
        end.setHours(23, 59, 59, 999);
      }
    } else {
      end.setHours(23, 59, 59, 999);
    }
    const diff = Math.max(0, end.getTime() - now.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, isExpired: diff <= 0 };
  };

  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryType, fixedExpiry]);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (expiryType === 'fixed' && time.isExpired) {
    return (
      <span className="text-xs font-bold text-rose-300 uppercase tracking-widest py-2">
        Offer Expired
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {[
        { value: pad(time.hours), label: 'Hrs' },
        { value: pad(time.minutes), label: 'Min' },
        { value: pad(time.seconds), label: 'Sec' },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="font-heading text-xl font-bold text-white tabular-nums">
              {unit.value}
            </span>
            <span className="text-[10px] text-teal-200 uppercase tracking-wide">{unit.label}</span>
          </div>
          {i < 2 && <span className="text-xl font-bold text-teal-300 mb-3">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function OfferBannerSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    showOfferBanner: true,
    showTimer: true,
    timerExpiryType: 'rolling',
    timerFixedExpiry: '',
    showProgressBar: true,
    claimedPercentage: 85,
    progressBarText: '🔥 [percentage]% of promotional seats claimed',
  });

  useEffect(() => {
    async function load() {
      const data = await db.getSystemSettings();
      setSettings({
        showOfferBanner: data.showOfferBanner ?? true,
        showTimer: data.showTimer ?? true,
        timerExpiryType: data.timerExpiryType ?? 'rolling',
        timerFixedExpiry: data.timerFixedExpiry ?? '',
        showProgressBar: data.showProgressBar ?? true,
        claimedPercentage: data.claimedPercentage ?? 85,
        progressBarText: data.progressBarText ?? '🔥 [percentage]% of promotional seats claimed',
      });
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const success = await db.updateSystemSettings(settings);
    if (success) {
      const currentFullSettings = JSON.parse(localStorage.getItem('tesca_school_settings') || '{}');
      const updatedFullSettings = { ...currentFullSettings, ...settings };
      localStorage.setItem('tesca_school_settings', JSON.stringify(updatedFullSettings));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } else {
      alert('Failed to save banner configuration to the database.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Loading Configuration...</p>
      </div>
    );
  }

  const isBannerActive = settings.showOfferBanner && (settings.showTimer || settings.showProgressBar);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight inline-flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          Offer Banner Settings
        </h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">
          Configure the promotional countdown card displayed on the pricing landing page with real-time preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls Form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-6 shadow-soft space-y-6">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">
            Banner Configuration Options
          </h3>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              {/* Show Offer Banner Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Show Countdown Offer Banner</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Enable or disable the promotion banner entirely</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, showOfferBanner: !settings.showOfferBanner })}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 focus:outline-none ${
                    settings.showOfferBanner ? 'bg-primary' : 'bg-gray-250'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                      settings.showOfferBanner ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Timer Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Show Countdown Timer</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Display the ticking countdown end clock</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, showTimer: !settings.showTimer })}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 focus:outline-none ${
                    settings.showTimer ? 'bg-primary' : 'bg-gray-250'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                      settings.showTimer ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Show Progress Bar Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Show Seats Progress Bar</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Display percentage bar for promotional seats claimed</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, showProgressBar: !settings.showProgressBar })}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 focus:outline-none ${
                    settings.showProgressBar ? 'bg-primary' : 'bg-gray-250'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                      settings.showProgressBar ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Timer Specific Options */}
              {settings.showTimer && (
                <div className="p-4 bg-teal-50/20 border border-teal-50/50 rounded-xl space-y-4">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Countdown Clock Settings</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Timer Expiry Mode</label>
                      <select
                        value={settings.timerExpiryType}
                        onChange={(e) => setSettings({ ...settings, timerExpiryType: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      >
                        <option value="rolling">Rolling (Resets every midnight)</option>
                        <option value="fixed">Fixed Date (Static deadline)</option>
                      </select>
                    </div>
                    {settings.timerExpiryType === 'fixed' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500">Fixed Deadline (ISO Format)</label>
                        <input
                          type="text"
                          value={settings.timerFixedExpiry}
                          onChange={(e) => setSettings({ ...settings, timerFixedExpiry: e.target.value })}
                          placeholder="e.g. 2026-08-31T23:59:59"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Bar Specific Options */}
              {settings.showProgressBar && (
                <div className="p-4 bg-amber-50/25 border border-amber-50/50 rounded-xl space-y-4">
                  <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Seats Bar Settings</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-500">Claimed Seats Percentage: <span className="text-gray-800 font-extrabold">{settings.claimedPercentage}%</span></label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.claimedPercentage}
                          onChange={(e) => setSettings({ ...settings, claimedPercentage: parseInt(e.target.value) || 0 })}
                          className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settings.claimedPercentage}
                          onChange={(e) => setSettings({ ...settings, claimedPercentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                          className="w-16 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-xs text-center font-bold text-gray-800 focus:bg-white focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Seats Alert Banner Text</label>
                      <input
                        type="text"
                        value={settings.progressBarText}
                        onChange={(e) => setSettings({ ...settings, progressBarText: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                        required
                      />
                      <span className="text-[10px] text-gray-400 font-semibold block leading-normal">
                        Use the <code className="bg-gray-100 text-gray-600 px-1 py-0.5 rounded font-mono">[percentage]</code> token to dynamically inject the claimed seats percentage.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
              {saveSuccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle className="h-4 w-4 animate-bounce" />
                  Banner configuration saved and live!
                </span>
              ) : (
                <span className="text-[10px] text-gray-400 font-medium">
                  Changes will propagate immediately to the student-facing pricing page.
                </span>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 transition-all hover:shadow-soft"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Interactive Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3 inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-gray-400" />
              Live Dashboard Preview
            </h3>

            {!isBannerActive ? (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center min-h-[160px]">
                <Megaphone className="h-8 w-8 text-gray-300 mb-2 stroke-1" />
                <p className="text-xs font-bold text-gray-400">Offer Banner Inactive</p>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[240px] leading-relaxed">
                  Turn on "Show Countdown Offer Banner" and enable either the Countdown Timer or the Seats Progress Bar to display the banner.
                </p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#062426] to-[#0c4447] border border-primary/20 px-6 py-6 text-white shadow-soft-lg flex flex-col gap-4">
                {/* Background glows */}
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-secondary/10 blur-2xl" />
                  <div className="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />
                </div>

                <div className="relative z-10 space-y-3">
                  <span className="inline-flex items-center gap-1 bg-secondary/20 border border-secondary/35 text-secondary text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    ⚡ Limited Time Promotion
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Enroll Today & Save!
                  </h3>

                  {settings.showProgressBar && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-teal-100 font-semibold leading-relaxed">
                        {settings.progressBarText.replace('[percentage]', String(settings.claimedPercentage))}
                      </p>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-secondary to-amber-400 transition-all duration-300 ease-out"
                          style={{ width: `${settings.claimedPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {settings.showTimer && (
                  <div className="relative z-10 shrink-0 bg-white/5 border border-white/10 p-3.5 rounded-xl shadow-soft flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-teal-200 font-bold uppercase tracking-widest flex items-center gap-1">
                      Offer Ends In:
                    </span>
                    <CountdownTimerPreview expiryType={settings.timerExpiryType} fixedExpiry={settings.timerFixedExpiry} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Help Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">💡 Designing Banners</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The preview represents exactly how the marketing banner will display to visiting students at <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">/pricing</code>. Use rolling timers for continuous promotions, or fixed dates for major school launches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
