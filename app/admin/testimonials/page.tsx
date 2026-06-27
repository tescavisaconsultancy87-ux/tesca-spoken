'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShieldAlert, Star, CheckCircle, EyeOff, X } from 'lucide-react';
import { db } from '@/lib/db';
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from '@/components/animate-ui/primitives/base/alert-dialog';

interface Testimonial {
  id: string;
  name: string;
  course: string;
  rating: number;
  message: string;
  status: 'approved' | 'hidden';
  date: string;
}

export default function AdminTestimonialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTestimonialId, setDeleteTestimonialId] = useState<string | null>(null);

  const loadTestimonials = async () => {
    try {
      const data = await db.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    course: 'Spoken English Mastery',
    rating: 5,
    message: '',
  });

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: Testimonial = {
      id: `test-${Date.now()}`,
      name: newTestimonial.name,
      course: newTestimonial.course,
      rating: newTestimonial.rating,
      message: newTestimonial.message,
      status: 'approved',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    await db.createTestimonial(created);
    setNewTestimonial({ name: '', course: 'Spoken English Mastery', rating: 5, message: '' });
    setIsAdding(false);
    loadTestimonials();
  };

  const handleDelete = (id: string) => {
    setDeleteTestimonialId(id);
  };

  const handleToggleStatus = async (id: string, currentStatus: 'approved' | 'hidden') => {
    const nextStatus = currentStatus === 'approved' ? 'hidden' : 'approved';
    await db.updateTestimonialStatus(id, nextStatus);
    loadTestimonials();
  };

  const filteredTestimonials = testimonials.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Testimonials Manager</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Approve, hide, and manage reviews displayed on the website</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Review
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Add Review Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">Add Testimonial</h3>
              <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddTestimonial} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rohan Patel"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Course Taken</label>
                  <select
                    value={newTestimonial.course}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, course: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Spoken English Mastery</option>
                    <option>Business Communication</option>
                    <option>Vocabulary Accelerator</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Rating Stars</label>
                  <select
                    value={newTestimonial.rating}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Review Message</label>
                <textarea
                  placeholder="Tell us what you liked..."
                  value={newTestimonial.message}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none h-24 resize-none"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-soft"
                >
                  Approve & Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonials.map((t) => (
          <div
            key={t.id}
            className={`bg-white border rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between space-y-4 ${
              t.status === 'hidden' ? 'opacity-60 bg-gray-50/55' : 'border-gray-100/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-secondary-50 text-secondary flex items-center justify-center font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800">{t.name}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">{t.course}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 font-medium leading-normal italic">
                "{t.message}"
              </p>
            </div>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Date: {t.date}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(t.id, t.status)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    t.status === 'approved'
                      ? 'border-gray-100 hover:bg-gray-50 text-gray-500'
                      : 'border-emerald-100 hover:bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {t.status === 'approved' ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Hide Review
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approve
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg border border-gray-100 hover:border-rose-100 text-rose-600 hover:bg-rose-50"
                  title="Delete Review"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteTestimonialId !== null} onOpenChange={(open) => { if (!open) setDeleteTestimonialId(null); }}>
        <AlertDialogPortal>
          <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <AlertDialogPopup
            from="bottom"
            className="sm:max-w-md border bg-white rounded-3xl p-6 shadow-2xl"
          >
            <AlertDialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
                <Trash2 className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">
                Delete Review?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this testimonial review? This action cannot be undone and it will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                onClick={async () => {
                  if (deleteTestimonialId) {
                    await db.deleteTestimonial(deleteTestimonialId);
                    loadTestimonials();
                    setDeleteTestimonialId(null);
                  }
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft"
              >
                Delete Review
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}

