'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Video, Calendar, Clock, User, X } from 'lucide-react';
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

interface LiveClass {
  id: string;
  topic: string;
  trainer: string;
  date_time: string;
  duration: string;
  join_url?: string;
  status: string;
}

export default function TutorLiveClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<LiveClass | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    topic: '',
    trainer: 'Sarah Jenkins',
    date_time: '',
    duration: '60 mins',
    join_url: '',
  });

  const loadData = async () => {
    try {
      const data = await db.getLiveClasses();
      setLiveClasses(data);
    } catch (err) {
      console.error('Failed to load live classes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingClass(null);
    setFormData({
      topic: '',
      trainer: 'Sarah Jenkins',
      date_time: '',
      duration: '60 mins',
      join_url: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lc: LiveClass) => {
    setEditingClass(lc);
    setFormData({
      topic: lc.topic,
      trainer: lc.trainer,
      date_time: lc.date_time,
      duration: lc.duration,
      join_url: lc.join_url || '',
    });
    setIsModalOpen(true);
  };

  const triggerNotification = async (type: string, details: any) => {
    try {
      const { supabase, ensureSupabaseClient } = await import('@/lib/supabaseClient');
      await ensureSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch('/api/notify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ type, details })
          });
        }
      }
    } catch (err) {
      console.error('Failed to trigger notification:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const status = db.computeStatus(formData.date_time, formData.duration);
    if (editingClass) {
      await db.updateLiveClass(editingClass.id, { ...formData, status });
      await triggerNotification('live-class-update', {
        topic: formData.topic,
        trainer: formData.trainer,
        dateTime: formData.date_time,
        duration: formData.duration,
        joinUrl: formData.join_url
      });
    } else {
      const newId = `lc-${Date.now()}`;
      await db.createLiveClass({ id: newId, ...formData, status });
      await triggerNotification('live-class-create', {
        topic: formData.topic,
        trainer: formData.trainer,
        dateTime: formData.date_time,
        duration: formData.duration,
        joinUrl: formData.join_url
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (deleteId) {
      const classToDelete = liveClasses.find(lc => lc.id === deleteId);
      await db.deleteLiveClass(deleteId);
      
      if (classToDelete) {
        await triggerNotification('live-class-delete', {
          topic: classToDelete.topic,
          trainer: classToDelete.trainer
        });
      }
      
      setDeleteId(null);
      loadData();
    }
  };

  const filtered = liveClasses.filter((lc) =>
    lc.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lc.trainer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    live: 'bg-secondary text-white',
    upcoming: 'bg-primary-50 text-primary',
    completed: 'bg-gray-100 text-gray-550',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Live Classes</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Schedule, manage, and record live class sessions</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Live Class
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search classes or trainers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-55">
              <h3 className="text-base font-bold text-gray-800">
                {editingClass ? 'Edit Live Class' : 'Create Live Class'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Topic / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Vocabulary Blast: Idioms for Social Gatherings"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Trainer</label>
                  <select
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Sarah Jenkins</option>
                    <option>David Vance</option>
                    <option>Emma Watson</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>30 mins</option>
                    <option>45 mins</option>
                    <option>60 mins</option>
                    <option>90 mins</option>
                    <option>120 mins</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.date_time}
                    onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Google Meet Join Link</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.join_url}
                    onChange={(e) => setFormData({ ...formData, join_url: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-55">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-soft"
                >
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 sm:p-5">Class</th>
                <th className="p-4 sm:p-5">Schedule</th>
                <th className="p-4 sm:p-5">Duration</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                    <Video className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    No live classes found. Create your first session above.
                  </td>
                </tr>
              ) : (
                filtered.map((lc) => (
                  <tr key={lc.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-secondary-50 text-secondary flex items-center justify-center">
                          <Video className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{lc.topic}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {lc.trainer}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {lc.date_time}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        {lc.duration}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      {(() => {
                        const status = db.computeStatus(lc.date_time, lc.duration);
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[status] || 'bg-gray-100 text-gray-500'}`}>
                            {status === 'live' && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                            {status}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(lc)}
                          className="p-1.5 rounded-lg border border-gray-100 text-primary hover:bg-primary-50"
                          title="Edit Class"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(lc.id)}
                          className="p-1.5 rounded-lg border border-gray-100 text-rose-600 hover:bg-rose-50"
                          title="Delete Class"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogPortal>
          <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <AlertDialogPopup from="bottom" className="sm:max-w-md border bg-white rounded-3xl p-6 shadow-2xl">
            <AlertDialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
                <Trash2 className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">Delete Live Class?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-550 mt-2">
                Are you sure you want to delete this live class? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft"
              >
                Delete
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
