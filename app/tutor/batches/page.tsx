'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Users, Calendar, Clock, User, X, ChevronDown, UserPlus, Trash } from 'lucide-react';
import { db } from '@/lib/db';
import { SaveToggle, ButtonStatus } from '@/components/ui/SaveToggle';
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

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
}

interface Batch {
  id: string;
  name: string;
  time_period: string;
  student_ids: string[]; // parsed from JSON
  created_at: string;
}

export default function TutorBatchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<ButtonStatus>('idle');

  useEffect(() => {
    if (isModalOpen) {
      setSaveStatus('idle');
    }
  }, [isModalOpen]);

  const [formData, setFormData] = useState({
    name: '',
    time_period: '',
    student_ids: [] as string[],
  });

  const loadData = async () => {
    try {
      const bData = await db.getBatches();
      const parsedBatches = bData.map((b: any) => ({
        ...b,
        student_ids: Array.isArray(b.student_ids)
          ? b.student_ids
          : typeof b.student_ids === 'string'
          ? JSON.parse(b.student_ids)
          : [],
      }));
      setBatches(parsedBatches);

      const sData = await db.getStudents();
      setStudents(sData);
    } catch (err) {
      console.error('Failed to load batches or students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingBatch(null);
    setFormData({
      name: '',
      time_period: '',
      student_ids: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Batch) => {
    setEditingBatch(b);
    setFormData({
      name: b.name,
      time_period: b.time_period,
      student_ids: b.student_ids,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('loading');

    const payload = {
      name: formData.name,
      time_period: formData.time_period,
      student_ids: formData.student_ids, // Supabase client takes care of encoding JSON/JSONB
    };

    try {
      if (editingBatch) {
        await db.updateBatch(editingBatch.id, payload);
      } else {
        const newId = `batch-${Date.now()}`;
        await db.createBatch({ id: newId, ...payload });
      }

      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('saved');
        setIsModalOpen(false);
        loadData();
      }, 1000);
    } catch (err) {
      console.error(err);
      setSaveStatus('idle');
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await db.deleteBatch(deleteId);
      setDeleteId(null);
      loadData();
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.student_ids.includes(studentId);
      const nextIds = alreadySelected
        ? prev.student_ids.filter((id) => id !== studentId)
        : [...prev.student_ids, studentId];
      return { ...prev, student_ids: nextIds };
    });
  };

  const filtered = batches.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.time_period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Student Batches</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Organize students into batches with dedicated timing</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Batch
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search batches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Loading indicator */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2 text-xs font-semibold">Loading batches...</p>
        </div>
      ) : (
        /* Batches Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-soft">
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-400 font-medium">No student batches found. Create your first batch above.</p>
            </div>
          ) : (
            filtered.map((b) => {
              // Map student IDs to actual student names
              const batchStudents = students.filter((s) => b.student_ids.includes(s.id));
              
              return (
                <div key={b.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-gray-800 tracking-tight leading-snug">{b.name}</h3>
                        <p className="text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {b.time_period}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-lg border border-gray-100 text-primary hover:bg-primary-50"
                          title="Edit Batch"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="p-1.5 rounded-lg border border-gray-100 text-rose-600 hover:bg-rose-50"
                          title="Delete Batch"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-50 pt-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Students ({batchStudents.length})
                      </p>
                      {batchStudents.length === 0 ? (
                        <p className="text-[11px] text-gray-450 italic">No students assigned to this batch</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                          {batchStudents.map((s) => (
                            <span
                              key={s.id}
                              className="text-[10px] bg-gray-50 border border-gray-100 text-gray-650 px-2.5 py-0.5 rounded-lg font-medium"
                              title={s.email}
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─── Create / Edit Modal ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-55">
              <h3 className="text-base font-bold text-gray-800">
                {editingBatch ? 'Edit Student Batch' : 'Create Student Batch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              {/* Batch Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Batch Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Evening Advanced Speakers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Time Period / Schedule text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Dedicated Time Period <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 06:00 PM - 07:30 PM (Mon-Fri) or Weekends 10:00 AM"
                  value={formData.time_period}
                  onChange={(e) => setFormData({ ...formData, time_period: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Students Multi-Select checklist */}
              <div className="space-y-2 border-t border-gray-50 pt-3">
                <label className="text-xs font-bold text-gray-500 block">Select Students</label>
                <div className="border border-gray-100 rounded-xl max-h-48 overflow-y-auto divide-y divide-gray-50 bg-gray-50/20">
                  {students.length === 0 ? (
                    <p className="p-4 text-center text-xs text-gray-400">No students registered in directory</p>
                  ) : (
                    students.map((s) => {
                      const isChecked = formData.student_ids.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleStudent(s.id)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-gray-800 truncate">{s.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{s.email}</p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                  <span>{formData.student_ids.length} students selected</span>
                  {formData.student_ids.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, student_ids: [] }))}
                      className="text-rose-500 hover:underline"
                    >
                      Clear Selection
                    </button>
                  )}
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
                <SaveToggle
                  type="submit"
                  status={saveStatus}
                  setStatus={setSaveStatus}
                  size="sm"
                  idleText={editingBatch ? 'Save Changes' : 'Create Batch'}
                  savedText="Saved"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation ─── */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogPortal>
          <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <AlertDialogPopup from="bottom" className="sm:max-w-md border bg-white rounded-3xl p-6 shadow-2xl">
            <AlertDialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
                <Trash className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">Delete Student Batch?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-550 mt-2">
                Are you sure you want to delete this batch? Assigned students will not be deleted, but the batch categorization will be removed.
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
