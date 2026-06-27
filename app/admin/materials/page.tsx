'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, FileText, Headphones, FileCheck, X } from 'lucide-react';
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

interface StudyMaterial {
  id: string;
  name: string;
  category: 'grammar' | 'vocabulary' | 'speaking' | 'worksheet';
  format: 'PDF' | 'MP3' | 'DOCX';
  size: string;
  download_url: string;
  added_date: string;
}

export default function AdminMaterialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'grammar' as 'grammar' | 'vocabulary' | 'speaking' | 'worksheet',
    format: 'PDF' as 'PDF' | 'MP3' | 'DOCX',
    size: '',
    download_url: '',
  });

  const loadData = async () => {
    try {
      const data = await db.getStudyMaterials();
      setMaterials(data);
    } catch (err) {
      console.error('Failed to load study materials', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingMaterial(null);
    setFormData({ name: '', category: 'grammar', format: 'PDF', size: '', download_url: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mat: StudyMaterial) => {
    setEditingMaterial(mat);
    setFormData({
      name: mat.name,
      category: mat.category,
      format: mat.format,
      size: mat.size,
      download_url: mat.download_url,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      added_date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    if (editingMaterial) {
      await db.updateStudyMaterial(editingMaterial.id, payload);
    } else {
      const newId = `mat-${Date.now()}`;
      await db.createStudyMaterial({ id: newId, ...payload });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await db.deleteStudyMaterial(deleteId);
      setDeleteId(null);
      loadData();
    }
  };

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'MP3': return Headphones;
      case 'DOCX': return FileCheck;
      default: return FileText;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'MP3': return 'bg-amber-50 text-amber-600';
      case 'DOCX': return 'bg-blue-50 text-blue-600';
      default: return 'bg-rose-50 text-rose-600';
    }
  };

  const categoryLabels: Record<string, string> = {
    grammar: 'Grammar',
    vocabulary: 'Vocabulary',
    speaking: 'Speaking & Audio',
    worksheet: 'Worksheets',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Study Materials</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Upload and manage PDFs, audio files, and worksheets</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Upload Material
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">
                {editingMaterial ? 'Edit Material' : 'Upload Study Material'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Material Name</label>
                <input
                  type="text"
                  placeholder="e.g. 100 Common Idioms for Daily Conversation"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option value="grammar">Grammar</option>
                    <option value="vocabulary">Vocabulary</option>
                    <option value="speaking">Speaking & Audio</option>
                    <option value="worksheet">Worksheets</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">File Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="MP3">MP3</option>
                    <option value="DOCX">DOCX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2 MB"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Download URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.download_url}
                    onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
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
                  {editingMaterial ? 'Save Changes' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-400 font-medium">No materials found. Upload your first file above.</p>
            </div>
          ) : (
            filtered.map((mat) => {
              const Icon = getFormatIcon(mat.format);
              const colorClass = getFormatColor(mat.format);
              return (
                <div key={mat.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-gray-800 truncate leading-snug">{mat.name}</p>
                      <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-gray-400">
                        <span className="bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider text-[9px]">{mat.format}</span>
                        <span>{mat.size}</span>
                        <span className="text-gray-300">|</span>
                        <span>{categoryLabels[mat.category] || mat.category}</span>
                        <span>Added: {mat.added_date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEdit(mat)}
                      className="p-2 rounded-xl border border-gray-100 text-primary hover:bg-primary-50 transition-all"
                      title="Edit Material"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(mat.id)}
                      className="p-2 rounded-xl border border-gray-100 text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete Material"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
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
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">Delete Material?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you sure you want to delete this study material? This action cannot be undone.
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
