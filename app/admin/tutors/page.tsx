'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Users, Award, Briefcase, X, BadgeCheck } from 'lucide-react';
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

interface Trainer {
  id: string;
  name: string;
  role: string;
  experience: string;
  certification: string;
  students: string;
  specialization: string;
  photo: string;
  verified: boolean;
  show_on_homepage: boolean;
}

export default function AdminTutorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTrainerId, setDeleteTrainerId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<ButtonStatus>('idle');

  useEffect(() => {
    if (isModalOpen) {
      setSaveStatus('idle');
    }
  }, [isModalOpen]);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    experience: '',
    certification: '',
    students: '',
    specialization: '',
    photo: '',
    verified: true,
    show_on_homepage: true,
  });

  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    if (file.size > 600 * 1024) {
      setPhotoError('Image size must be less than 600KB.');
      e.target.value = '';
      return;
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setPhotoError('Only JPG/JPEG images are allowed.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result as string }));
    };
    reader.onerror = () => {
      setPhotoError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    async function load() {
      const data = await db.getTrainers();
      setTrainers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      role: '',
      experience: '1 year',
      certification: '',
      students: '100+',
      specialization: 'Spoken English',
      photo: 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
      verified: true,
      show_on_homepage: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      role: trainer.role,
      experience: trainer.experience || '',
      certification: trainer.certification || '',
      students: trainer.students || '',
      specialization: trainer.specialization || '',
      photo: trainer.photo || '',
      verified: !!trainer.verified,
      show_on_homepage: !!trainer.show_on_homepage,
    });
    setIsModalOpen(true);
  };

  const handleSaveTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('loading');

    try {
      if (editingTrainer) {
        // Edit Mode
        const updatedObj = {
          name: formData.name,
          role: formData.role,
          experience: formData.experience,
          certification: formData.certification,
          students: formData.students,
          specialization: formData.specialization,
          photo: formData.photo,
          verified: formData.verified,
          show_on_homepage: formData.show_on_homepage,
        };

        await db.updateTrainer(editingTrainer.id, updatedObj);

        setTrainers(
          trainers.map((t) =>
            t.id === editingTrainer.id
              ? {
                  ...t,
                  ...updatedObj,
                }
              : t
          )
        );
      } else {
        // Create Mode
        const newId = `trainer-${Date.now()}`;
        const createdObj = {
          id: newId,
          name: formData.name,
          role: formData.role,
          experience: formData.experience,
          certification: formData.certification,
          students: formData.students,
          specialization: formData.specialization,
          photo: formData.photo,
          verified: formData.verified,
          show_on_homepage: formData.show_on_homepage,
        };

        await db.createTrainer(createdObj);

        setTrainers([
          ...trainers,
          {
            ...createdObj,
          },
        ]);
      }

      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('saved');
        setIsModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setSaveStatus('idle');
    }
  };

  const handleDeleteTrainer = (id: string) => {
    setDeleteTrainerId(id);
  };

  const filteredTrainers = trainers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEditUnchanged = editingTrainer ? (
    formData.name === editingTrainer.name &&
    formData.role === editingTrainer.role &&
    formData.experience === (editingTrainer.experience || '') &&
    formData.certification === (editingTrainer.certification || '') &&
    formData.students === (editingTrainer.students || '') &&
    formData.specialization === (editingTrainer.specialization || '') &&
    formData.photo === (editingTrainer.photo || '') &&
    formData.verified === !!editingTrainer.verified &&
    formData.show_on_homepage === !!editingTrainer.show_on_homepage
  ) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Tutors Directory</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage details, expertise, and homepage visibility of trainers</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Tutor
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tutors, roles or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2 text-xs font-semibold">Loading tutors directory...</p>
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-soft">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-gray-700">No tutors found</h3>
          <p className="text-xs text-gray-400 mt-1">Try resetting search filter or add a new trainer profile.</p>
        </div>
      ) : (
        /* Trainers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between h-full space-y-4 group"
            >
              <div className="space-y-3 relative">
                {/* Photo */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                  <img
                    src={trainer.photo || 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'}
                    alt={trainer.name}
                    className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-800 leading-snug">{trainer.name}</h3>
                  <p className="text-xs font-semibold text-primary">{trainer.role}</p>
                </div>

                {/* Details */}
                <div className="space-y-1.5 pt-1 text-[11px] font-medium text-gray-500 border-t border-gray-55">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Exp: {trainer.experience}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 text-xs font-bold pt-2 border-t border-gray-55">
                <button
                  onClick={() => handleDeleteTrainer(trainer.id)}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50 text-rose-600 transition-colors"
                  title="Delete Tutor Profile"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleOpenEditModal(trainer)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-all"
                >
                  Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Tutor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">
                {editingTrainer ? 'Edit Tutor Profile' : 'Add New Tutor Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTrainer} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Avadh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Expertise / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Lead IELTS Trainer, Pronunciation Expert"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Tutor Photo (JPG, Max 600KB)</label>
                <div className="flex items-center gap-4">
                  {formData.photo && (
                    <div className="h-16 w-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-55 shrink-0">
                      <img src={formData.photo} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg"
                      onChange={handlePhotoChange}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 cursor-pointer"
                    />
                    {photoError && <p className="text-[10px] text-rose-500 font-semibold mt-1">{photoError}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Experience</label>
                <input
                  type="text"
                  placeholder="e.g. 10 years, 8+ years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-50">
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
                  idleText={editingTrainer ? 'Save Changes' : 'Add Tutor'}
                  savedText="Saved"
                  disabled={isEditUnchanged}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Trainer Confirmation Alert Dialog */}
      <AlertDialog open={deleteTrainerId !== null} onOpenChange={(open) => { if (!open) setDeleteTrainerId(null); }}>
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
                Delete Tutor Profile?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this trainer profile? This profile will be removed from the directory and homepage trainers list.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                onClick={async () => {
                  if (deleteTrainerId) {
                    await db.deleteTrainer(deleteTrainerId);
                    setTrainers(trainers.filter((t) => t.id !== deleteTrainerId));
                    setDeleteTrainerId(null);
                  }
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft"
              >
                Delete Profile
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
