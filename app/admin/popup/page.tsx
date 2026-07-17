'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Trash2, Edit, CheckCircle, HelpCircle, Eye, Upload, X } from 'lucide-react';
import { supabase, ensureSupabaseClient } from '@/lib/supabaseClient';
import { SaveToggle, ButtonStatus } from '@/components/ui/SaveToggle';

interface PopupSetting {
  id: number;
  is_active: boolean;
  image_url: string;
  title: string;
  subtitle: string;
  delay_seconds: number;
  button_text: string;
  link_url: string;
  lead_capture_enabled: boolean;
  required_fields: string[];
}

export default function PromoPopupAdminPage() {
  const [popups, setPopups] = useState<PopupSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<ButtonStatus>('idle');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [leadCaptureEnabled, setLeadCaptureEnabled] = useState(false);
  const [requiredEmail, setRequiredEmail] = useState(false);
  const [delaySeconds, setDelaySeconds] = useState(5);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [buttonText, setButtonText] = useState('Speak to Counsellor');
  const [linkUrl, setLinkUrl] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('/og-image.jpg');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const headers: Record<string, string> = {};
        await ensureSupabaseClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }
        }
        const response = await fetch('/api/admin/popup', { headers });
        if (response.ok) {
          const data = await response.json();
          setPopups(data);
        }
      } catch (err) {
        console.error('Failed to fetch popups:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Size check (< 600 KB)
    const maxBytes = 600 * 1024;
    if (file.size > maxBytes) {
      alert('Error: File size must be less than 600KB.');
      e.target.value = '';
      return;
    }

    // 2. Aspect ratio check (1:1 square)
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width !== img.height) {
        alert(`Error: Image must be a 1:1 square. Selected image is ${img.width}x${img.height}.`);
        e.target.value = '';
        URL.revokeObjectURL(img.src);
        return;
      }
      setSelectedFile(file);
      setImagePreview(img.src);
    };
  };

  const resetForm = () => {
    setEditingId(null);
    setIsActive(false);
    setLeadCaptureEnabled(false);
    setRequiredEmail(false);
    setDelaySeconds(5);
    setTitle('');
    setSubtitle('');
    setButtonText('Speak to Counsellor');
    setLinkUrl('');
    setSelectedFile(null);
    setImageUrl('');
    setImagePreview('/og-image.jpg');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (p: PopupSetting) => {
    setEditingId(p.id);
    setIsActive(p.is_active);
    setLeadCaptureEnabled(p.lead_capture_enabled);
    setRequiredEmail((p.required_fields || []).includes('email'));
    setDelaySeconds(p.delay_seconds);
    setTitle(p.title);
    setSubtitle(p.subtitle);
    setButtonText(p.button_text);
    setLinkUrl(p.link_url);
    setImageUrl(p.image_url);
    setImagePreview(p.image_url);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this promotional popup?')) return;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      await ensureSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }
      const response = await fetch('/api/admin/popup', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setPopups(popups.filter((p) => p.id !== id));
        if (editingId === id) resetForm();
      } else {
        const err = await response.json();
        alert(`Failed to delete: ${err.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error('Delete error:', e);
      alert('An error occurred during deletion.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveStatus('loading');

    try {
      let finalImageUrl = imageUrl;

      // 1. Upload new image if selected
      if (selectedFile) {
        await ensureSupabaseClient();
        if (!supabase) {
          throw new Error('Supabase client connection failed.');
        }

        const ext = selectedFile.name.split('.').pop() || 'webp';
        const key = `promo-popup/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('tesca-assets')
          .upload(key, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage.from('tesca-assets').getPublicUrl(key);
        finalImageUrl = publicUrlData.publicUrl;
      }

      if (!finalImageUrl) {
        throw new Error('Popup Image is required.');
      }

      // 2. Prepare payload
      const finalRequiredFields = ['name', 'phone'];
      if (requiredEmail) finalRequiredFields.push('email');

      const payload = {
        id: editingId,
        is_active: isActive,
        image_url: finalImageUrl,
        title,
        subtitle,
        delay_seconds: delaySeconds,
        button_text: buttonText,
        link_url: linkUrl,
        lead_capture_enabled: leadCaptureEnabled,
        required_fields: finalRequiredFields,
      };

      // 3. Post to API
      const url = '/api/admin/popup';
      const method = editingId ? 'PATCH' : 'POST';

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      await ensureSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save settings.');
      }

      // 4. Update local list
      if (editingId) {
        setPopups(popups.map((p) => (p.id === editingId ? result.data : p)));
      } else {
        setPopups([result.data, ...popups]);
      }

      setSaveStatus('success');
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveStatus('saved');
        resetForm();
      }, 1000);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

    } catch (err: any) {
      alert(err.message || 'An error occurred while saving.');
      setSaveStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Loading Popups...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight inline-flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Promotional Popup Manager
        </h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">
          Configure visual promo flyers that display to website visitors after a custom delay
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Controls Form */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl p-6 shadow-soft space-y-6">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">
            {editingId ? 'Edit Promo Popup' : 'Publish New Popup'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Active Toggle Switch */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-800">Enable Promo Popup</p>
                <p className="text-[10px] text-gray-400 font-semibold">Toggle displaying this flyer on the public website</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-10 h-6 rounded-full p-1 transition-all duration-300 focus:outline-none ${
                  isActive ? 'bg-primary' : 'bg-gray-250'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                    isActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Capture Leads Toggle Switch */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-800">Capture Leads Directly</p>
                <p className="text-[10px] text-gray-400 font-semibold">Enable registration form inside the flyer details landing page</p>
              </div>
              <button
                type="button"
                onClick={() => setLeadCaptureEnabled(!leadCaptureEnabled)}
                className={`w-10 h-6 rounded-full p-1 transition-all duration-300 focus:outline-none ${
                  leadCaptureEnabled ? 'bg-primary' : 'bg-gray-250'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                    leadCaptureEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Required Fields Section */}
            {leadCaptureEnabled && (
              <div className="p-4 bg-primary-50/20 border border-primary-100/50 rounded-xl space-y-2.5">
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Required Form Fields</p>
                <div className="flex flex-wrap gap-5 text-xs text-gray-600 font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked disabled className="rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
                    <span>Name (Required)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked disabled className="rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
                    <span>Phone (Required)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requiredEmail}
                      onChange={(e) => setRequiredEmail(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                    />
                    <span>Email Address</span>
                  </label>
                </div>
              </div>
            )}

            {/* Title / Headline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Popup Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. UK Study Visa 2026 Intake Now Open!"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            {/* Subtitle / Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Popup Description</label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Submit your inquiry request below to secure a callback."
                rows={2}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Delay */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Display Delay (Seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={delaySeconds}
                  onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 5)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                  required
                />
              </div>

              {/* Button text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">CTA Button Text</label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="e.g. Speak to Counsellor"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Custom Link Redirect URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Optional Redirect Link URL (Overrides Landing Page)</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. https://tesca.co/courses/ielts-prep"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
              />
            </div>

            {/* Upload File */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500">Upload Flyer Photo (1:1 Square, Max 600KB)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  Select File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                />
                {selectedFile && (
                  <span className="text-[10px] text-primary font-bold truncate max-w-[200px]">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)}KB)
                  </span>
                )}
                {!selectedFile && imageUrl && (
                  <span className="text-[10px] text-gray-400 truncate max-w-[200px]">
                    Existing: {imageUrl.split('/').pop()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50">
              {saveSuccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle className="h-4 w-4 animate-bounce" />
                  Popup settings published successfully!
                </span>
              ) : (
                <div className="flex items-center gap-1">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-150 rounded-xl hover:bg-gray-100 text-gray-600 text-xs font-bold cursor-pointer mr-2"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <span className="text-[10px] text-gray-450 font-semibold">
                    Image ratio validation of 1:1 is strictly enforced.
                  </span>
                </div>
              )}
              <SaveToggle
                type="submit"
                status={saveStatus}
                setStatus={setSaveStatus}
                size="sm"
                idleText={editingId ? 'Save Changes' : 'Publish Popup'}
                savedText="Saved"
              />
            </div>
          </form>
        </div>

        {/* Right Side: Preview & List Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Popups list */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3">
              Published Popups ({popups.length})
            </h3>
            {popups.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4 font-semibold">No popups in database.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {popups.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-50 bg-gray-50/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate leading-tight">{p.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${p.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                            {p.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-[9px] text-gray-400 font-semibold">{p.delay_seconds}s delay</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 rounded-lg text-primary hover:bg-primary-50 transition-colors cursor-pointer border border-transparent"
                        title="Edit Popup"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent"
                        title="Delete Popup"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Live Preview */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-3 inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-gray-400" />
              Live Interactive Preview
            </h3>

            {/* Square Popup Container */}
            <div className="bg-[#051c1d] border border-gray-800/80 rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
              <div className="bg-white w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative border border-gray-100 scale-100 transform transition-all duration-300">

                {/* Close button */}
                <span className="absolute top-2 right-2 z-10 p-1 bg-slate-900/10 rounded-full text-slate-700/60">
                  <X className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>

                {/* Image flyer aspect ratio 1:1 */}
                <div className="w-full aspect-square relative bg-slate-900 overflow-hidden flex items-center justify-center">
                  <img src={imagePreview} alt="" className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110 pointer-events-none select-none" />
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 m-auto max-w-full max-h-full object-contain p-2 pointer-events-none select-none" />
                </div>

                {/* Content details */}
                <div className="p-4 flex flex-col text-left bg-white border-t border-gray-50">
                  <span className="inline-block text-[8px] font-extrabold uppercase tracking-widest text-primary bg-primary-50/50 border border-primary-100/50 px-2 py-0.5 rounded mb-1.5 self-start">
                    Featured Flyer Offer
                  </span>
                  <h4 className="text-xs font-extrabold tracking-tight text-gray-800 leading-tight">
                    {title || 'Special Update'}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal font-sans font-medium line-clamp-2">
                    {subtitle || 'Sign up to get the latest news and guides.'}
                  </p>

                  <div className="mt-3">
                    <button type="button" className="w-full py-2 bg-primary text-white font-bold text-[10px] rounded-lg shadow-sm hover:bg-primary-600 transition-colors">
                      {buttonText || 'Get Details'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
