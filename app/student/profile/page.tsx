'use client';

import { useState, useEffect } from 'react';
import { User, Shield, CreditCard, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { SaveToggle, ButtonStatus } from '@/components/ui/SaveToggle';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [profileSaveStatus, setProfileSaveStatus] = useState<ButtonStatus>('idle');
  const [passwordSaveStatus, setPasswordSaveStatus] = useState<ButtonStatus>('idle');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    joinedDate: '',
    currentLevel: 'Intermediate (B1)',
  });

  useEffect(() => {
    setProfileSaveStatus('idle');
    setPasswordSaveStatus('idle');
  }, [activeTab]);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    const userName = user.name;
    const userEmail = user.email;
    async function loadProfile() {
      const data = await db.getProfile(userId);
      if (data) {
        setProfileData({
          name: data.name || userName || '',
          email: data.email || userEmail || '',
          phone: data.phone || '',
          location: data.location || '',
          joinedDate: data.created_at
            ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'July 2026',
          currentLevel: data.level || 'Intermediate (B1)',
        });
      } else {
        setProfileData((prev) => ({
          ...prev,
          name: userName || '',
          email: userEmail || '',
          joinedDate: 'July 2026',
        }));
      }
    }
    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setValidationError('');
    
    // Validate phone: must be exactly 10 digits
    const cleanedPhone = profileData.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setValidationError('Phone number must be exactly 10 digits.');
      return;
    }
    
    if (activeTab === 'profile') {
      setProfileSaveStatus('loading');
      const success = await db.updateProfile(user.id, {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location
      });

      if (success) {
        setProfileSaveStatus('success');
        setSaveSuccess(true);
        setTimeout(() => {
          setProfileSaveStatus('saved');
        }, 800);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setProfileSaveStatus('idle');
      }
    } else if (activeTab === 'security') {
      setPasswordSaveStatus('loading');
      // Simulate API call for password update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordSaveStatus('success');
      setSaveSuccess(true);
      setTimeout(() => {
        setPasswordSaveStatus('saved');
      }, 800);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  const getInitials = () => {
    if (!profileData.name) return 'S';
    return profileData.name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Account Settings</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage your personal information, security, and subscription plans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Quick Profile Card & Tabs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-soft">
            <div className="relative mx-auto h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
              {getInitials()}
              <span className="absolute bottom-0 right-0 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <h3 className="text-base font-bold text-gray-800">{profileData.name}</h3>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Student</p>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-around text-center text-xs font-semibold">
              <div>
                <p className="text-gray-400">Level</p>
                <p className="text-gray-700 font-bold mt-0.5">{profileData.currentLevel.split(' ')[0]}</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div>
                <p className="text-gray-400">Joined</p>
                <p className="text-gray-700 font-bold mt-0.5">{profileData.joinedDate}</p>
              </div>
            </div>
          </div>

          {/* Navigation vertical tabs */}
          <div className="bg-white border border-gray-100 rounded-2xl p-2.5 shadow-soft space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-primary/5 text-primary'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <User className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-primary/5 text-primary'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Shield className="h-4 w-4" />
              Security Settings
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'billing'
                  ? 'bg-primary/5 text-primary'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Plans & Billing
            </button>
          </div>
        </div>

        {/* Right: Content Forms */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft">
            {activeTab === 'profile' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
                  {saveSuccess ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      Profile details saved successfully!
                    </span>
                  ) : validationError ? (
                    <span className="text-xs font-semibold text-rose-600">
                      {validationError}
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-medium">Click Save Changes to update your account profile.</span>
                  )}
                  <SaveToggle
                    type="submit"
                    status={profileSaveStatus}
                    setStatus={setProfileSaveStatus}
                    size="sm"
                    idleText="Save Changes"
                    savedText="Saved"
                  />
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">Update Password</h3>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
                  {saveSuccess ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      Password updated successfully!
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-medium">Keep password complex to keep your account safe.</span>
                  )}
                  <SaveToggle
                    type="submit"
                    status={passwordSaveStatus}
                    setStatus={setPasswordSaveStatus}
                    size="sm"
                    idleText="Update Password"
                    savedText="Updated"
                  />
                </div>
              </form>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">Subscription Plan</h3>
                </div>

                <div className="p-5 border border-primary-100 bg-primary-50/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary bg-white px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      Active Plan
                    </span>
                    <h4 className="text-base font-bold text-gray-800">Spoken English Pro — Unlimited Access</h4>
                    <p className="text-xs text-gray-400 font-medium">Next billing date: July 10, 2026 (₹2,499.00/month)</p>
                  </div>

                  <button className="text-xs font-bold text-primary hover:text-primary-600 border border-primary/20 hover:border-primary bg-white px-4 py-2.5 rounded-xl transition-all shadow-sm">
                    Manage Plan
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3 mt-4">Invoice History</h3>
                </div>

                <div className="divide-y divide-gray-50">
                  <div className="py-3.5 flex justify-between items-center text-xs font-medium">
                    <div>
                      <p className="font-bold text-gray-800">Invoice #INV-2026-002</p>
                      <p className="text-gray-400 text-[10px]">June 10, 2026</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700 font-bold">₹2,499.00</span>
                      <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Download</button>
                    </div>
                  </div>
                  <div className="py-3.5 flex justify-between items-center text-xs font-medium">
                    <div>
                      <p className="font-bold text-gray-800">Invoice #INV-2026-001</p>
                      <p className="text-gray-400 text-[10px]">May 10, 2026</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-700 font-bold">₹2,499.00</span>
                      <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Download</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
