'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, HelpCircle } from 'lucide-react';
import { db } from '@/lib/db';

export default function AdminSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'TESCA Spoken English',
    contactEmail: 'contact@tesca.com',
    supportPhone: '+91 98765 43210',
    currency: 'INR (₹)',
    enableRegistrations: true,
    maintenanceMode: false,
    enableFreeTest: true,
    // Pricing promotions settings
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
      setSchoolSettings(data);
      // Sync local storage fallback
      localStorage.setItem('tesca_school_settings', JSON.stringify(data));
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    
    const success = await db.updateSystemSettings(schoolSettings);
    if (success) {
      localStorage.setItem('tesca_school_settings', JSON.stringify(schoolSettings));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } else {
      alert('Failed to save settings to the database.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Global System Settings</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Control platform parameters, contact details, payment setups, and portal modes</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft">
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">School Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">School / Platform Name</label>
                <input
                  type="text"
                  value={schoolSettings.schoolName}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Support Contact Email</label>
                <input
                  type="email"
                  value={schoolSettings.contactEmail}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, contactEmail: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Support Phone Line</label>
                <input
                  type="text"
                  value={schoolSettings.supportPhone}
                  onChange={(e) => setSchoolSettings({ ...schoolSettings, supportPhone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* System Control Settings */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">Portal Features</h3>
            <div className="space-y-3.5 max-w-xl">
              {/* Toggles */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Activate Level Evaluation Test</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Enable free test evaluation prompts on landing page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSchoolSettings({ ...schoolSettings, enableFreeTest: !schoolSettings.enableFreeTest })}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${
                    schoolSettings.enableFreeTest ? 'bg-primary' : 'bg-gray-250'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                      schoolSettings.enableFreeTest ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="space-y-0.5 flex-1">
                  <p className="text-xs font-bold text-gray-800 inline-flex items-center gap-1.5">
                    Platform Maintenance Mode
                    <span className="bg-rose-50 text-rose-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Critical
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold">Force redirect student logins to maintenance page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSchoolSettings({ ...schoolSettings, maintenanceMode: !schoolSettings.maintenanceMode })}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${
                    schoolSettings.maintenanceMode ? 'bg-rose-500' : 'bg-gray-250'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                      schoolSettings.maintenanceMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>



          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-50">
            {saveSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle className="h-4 w-4" />
                Global settings updated successfully!
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 font-medium">Be cautious when saving critical modes such as maintenance.</span>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 transition-all hover:shadow-soft"
            >
              <Save className="h-4 w-4" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
