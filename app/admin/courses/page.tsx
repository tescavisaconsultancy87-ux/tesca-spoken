'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Users, BookOpen, X } from 'lucide-react';
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

interface Course {
  id: string;
  title: string;
  trainer: string;
  category: string;
  price: number;
  studentsCount: number;
  lessonsCount: number;
  originalPrice: number;
  duration: string;
  level: string;
  accent: string;
  benefits: string;
  popular: boolean;
}

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    trainer: 'Sarah Jenkins',
    category: 'Fluency & Pronunciation',
    price: 2999,
    lessonsCount: 10,
    originalPrice: 4999,
    duration: '3 Months',
    level: 'Beginner',
    accent: 'primary',
    benefits: [''],
    popular: false,
  });

  useEffect(() => {
    async function load() {
      const data = await db.getCourses();
      const mapped = data.map((c: any) => ({
        id: c.id,
        title: c.title,
        trainer: c.trainer,
        category: c.category,
        price: Number(c.price),
        studentsCount: c.students_count || 0,
        lessonsCount: c.lessons_count || 12,
        originalPrice: Number(c.original_price || c.price || 0),
        duration: c.duration || '3 Months',
        level: c.level || 'Beginner',
        accent: c.accent || 'primary',
        benefits: c.benefits || '',
        popular: !!c.popular,
      }));
      setCourses(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      trainer: 'Sarah Jenkins',
      category: 'Fluency & Pronunciation',
      price: 2999,
      lessonsCount: 10,
      originalPrice: 4999,
      duration: '3 Months',
      level: 'Beginner',
      accent: 'primary',
      benefits: [''],
      popular: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      trainer: course.trainer,
      category: course.category,
      price: course.price,
      lessonsCount: course.lessonsCount,
      originalPrice: course.originalPrice,
      duration: course.duration,
      level: course.level,
      accent: course.accent,
      benefits: course.benefits
        ? course.benefits.split(',').map((b) => b.trim()).filter(Boolean)
        : [''],
      popular: course.popular,
    });
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedBenefits = formData.benefits.map((b) => b.trim()).filter(Boolean).join(', ');

    if (editingCourse) {
      // Edit Mode
      const updatedObj = {
        title: formData.title,
        trainer: formData.trainer,
        category: formData.category,
        price: Number(formData.price),
        lessons_count: Number(formData.lessonsCount),
        original_price: Number(formData.originalPrice),
        duration: formData.duration,
        level: formData.level,
        accent: formData.accent,
        benefits: formattedBenefits,
        popular: formData.popular,
      };

      await db.updateCourse(editingCourse.id, updatedObj);

      setCourses(
        courses.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                title: formData.title,
                trainer: formData.trainer,
                category: formData.category,
                price: Number(formData.price),
                lessonsCount: Number(formData.lessonsCount),
                originalPrice: Number(formData.originalPrice),
                duration: formData.duration,
                level: formData.level,
                accent: formData.accent,
                benefits: formattedBenefits,
                popular: formData.popular,
              }
            : c
        )
      );
    } else {
      // Create Mode
      const newId = `course-${Date.now()}`;
      const createdObj = {
        id: newId,
        title: formData.title,
        trainer: formData.trainer,
        category: formData.category,
        price: Number(formData.price),
        students_count: 0,
        lessons_count: Number(formData.lessonsCount),
        original_price: Number(formData.originalPrice),
        duration: formData.duration,
        level: formData.level,
        accent: formData.accent,
        benefits: formattedBenefits,
        popular: formData.popular,
      };

      await db.createCourse(createdObj);

      setCourses([
        ...courses,
        {
          id: createdObj.id,
          title: createdObj.title,
          trainer: createdObj.trainer,
          category: createdObj.category,
          price: createdObj.price,
          studentsCount: createdObj.students_count,
          lessonsCount: createdObj.lessons_count,
          originalPrice: createdObj.original_price,
          duration: createdObj.duration,
          level: createdObj.level,
          accent: createdObj.accent,
          benefits: createdObj.benefits,
          popular: createdObj.popular,
        },
      ]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    setDeleteCourseId(id);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Courses Management</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Configure course syllabi, pricing, and trainer assignments</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses or trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">
                {editingCourse ? 'Edit Course Details' : 'Create New Course'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCourse} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Public Speaking"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Price (INR)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Original Price (INR)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Months, 6 Weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Professional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Fluency & Pronunciation</option>
                    <option>Professional Skills</option>
                    <option>Vocabulary</option>
                    <option>Exam Preparation</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Trainer</label>
                  <select
                    value={formData.trainer}
                    onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Sarah Jenkins</option>
                    <option>David Vance</option>
                    <option>Emma Watson</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Lessons Count</label>
                  <input
                    type="number"
                    value={formData.lessonsCount}
                    onChange={(e) => setFormData({ ...formData, lessonsCount: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Accent Color Theme</label>
                  <select
                    value={formData.accent}
                    onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option value="primary">Teal (Primary)</option>
                    <option value="secondary">Orange (Secondary)</option>
                    <option value="accent">Red (Accent)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">Course Subdetails / Benefits (What You'll Learn)</label>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2 items-center animate-scale-up">
                      <span className="text-[11px] text-gray-400 font-bold w-5 text-right shrink-0">{index + 1}.</span>
                      <input
                        type="text"
                        placeholder="e.g. Grammar foundations"
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...formData.benefits];
                          newBenefits[index] = e.target.value;
                          setFormData({ ...formData, benefits: newBenefits });
                        }}
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                        required
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newBenefits = formData.benefits.filter((_, i) => i !== index);
                            setFormData({ ...formData, benefits: newBenefits });
                          }}
                          className="p-2 border border-gray-100 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
                          title="Remove Subdetail"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, benefits: [...formData.benefits, ''] })}
                  className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-primary hover:bg-primary-50/50 hover:border-primary/20 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Subdetail Item
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-gray-800">Most Popular Course Badge</p>
                  <p className="text-[10px] text-gray-400 font-semibold">Highlight this course with a "Popular" banner on frontend</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, popular: !formData.popular })}
                  className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${
                    formData.popular ? 'bg-primary' : 'bg-gray-250'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                      formData.popular ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
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
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between h-full space-y-4"
          >
            <div className="space-y-2 relative">
              {course.popular && (
                <span className="absolute -top-1 right-0 bg-secondary text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg uppercase tracking-wider z-10 shadow-soft">
                  Popular
                </span>
              )}
              <div className="flex justify-between items-start gap-4">
                <span className="bg-primary-50 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {course.category}
                </span>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-gray-800">₹{course.price.toLocaleString('en-IN')}</span>
                  {course.originalPrice > course.price && (
                    <span className="block text-[10px] text-gray-400 line-through font-semibold">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-800 leading-snug">{course.title}</h3>
              <p className="text-[11px] text-gray-400 font-semibold">Lead Trainer: {course.trainer}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-gray-55 text-gray-400 border border-gray-100 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {course.level}
                </span>
                <span className="bg-gray-55 text-gray-400 border border-gray-100 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {course.duration}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-50 py-3.5 text-xs font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{course.studentsCount} Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span>{course.lessonsCount} Lessons</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="inline-flex items-center justify-center p-2.5 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50 text-rose-600 transition-colors"
                title="Delete Course"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleOpenEditModal(course)}
                className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                Edit Course
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Course Confirmation Alert Dialog */}
      <AlertDialog open={deleteCourseId !== null} onOpenChange={(open) => { if (!open) setDeleteCourseId(null); }}>
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
                Delete Course?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this course? This action cannot be undone and will affect any student registrations associated with this course.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                onClick={async () => {
                  if (deleteCourseId) {
                    await db.deleteCourse(deleteCourseId);
                    setCourses(courses.filter((c) => c.id !== deleteCourseId));
                    setDeleteCourseId(null);
                  }
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft"
              >
                Delete Course
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
