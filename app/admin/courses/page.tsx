'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, Users, DollarSign, BookOpen, X, Award } from 'lucide-react';
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
}

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

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
      }));
      setCourses(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const [newCourse, setNewCourse] = useState({
    title: '',
    trainer: 'Sarah Jenkins',
    category: 'Fluency & Pronunciation',
    price: 29,
    lessonsCount: 10,
  });

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdObj = {
      id: `course-${courses.length + 1}`,
      title: newCourse.title,
      trainer: newCourse.trainer,
      category: newCourse.category,
      price: Number(newCourse.price),
      students_count: 0,
      lessons_count: Number(newCourse.lessonsCount),
    };
    
    await db.createCourse(createdObj);
    
    setCourses([...courses, {
      id: createdObj.id,
      title: createdObj.title,
      trainer: createdObj.trainer,
      category: createdObj.category,
      price: createdObj.price,
      studentsCount: createdObj.students_count,
      lessonsCount: createdObj.lessons_count,
    }]);
    
    setNewCourse({ title: '', trainer: 'Sarah Jenkins', category: 'Fluency & Pronunciation', price: 29, lessonsCount: 10 });
    setIsAdding(false);
  };

  const handleDeleteCourse = (id: string) => {
    setDeleteCourseId(id);
  };

  const filteredCourses = courses.filter((c) =>
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
          onClick={() => setIsAdding(true)}
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

      {/* Add Course Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">Create New Course</h3>
              <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Public Speaking"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Trainer</label>
                  <select
                    value={newCourse.trainer}
                    onChange={(e) => setNewCourse({ ...newCourse, trainer: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Sarah Jenkins</option>
                    <option>David Vance</option>
                    <option>Emma Watson</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Lessons Count</label>
                  <input
                    type="number"
                    value={newCourse.lessonsCount}
                    onChange={(e) => setNewCourse({ ...newCourse, lessonsCount: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Price (INR)</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    <option>Fluency & Pronunciation</option>
                    <option>Professional Skills</option>
                    <option>Vocabulary</option>
                  </select>
                </div>
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
                  Create Course
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
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="bg-primary-50 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="text-base font-extrabold text-gray-800">₹{course.price.toLocaleString('en-IN')}</span>
              </div>
              <h3 className="text-base font-bold text-gray-800 leading-snug">{course.title}</h3>
              <p className="text-xs text-gray-400 font-semibold">Lead Trainer: {course.trainer}</p>
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
              <button className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white transition-all">
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
            className="sm:max-w-md fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 border bg-white rounded-3xl p-6 shadow-2xl"
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

