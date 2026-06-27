'use client';

import { useState, useEffect } from 'react';
import { Play, Award, CheckCircle, Search, Clock, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';

interface Course {
  id: string;
  title: string;
  trainer: string;
  image: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  lastActive: string;
}

export default function StudentCoursesPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getCourses();
      const mapped = data.map((c: any) => ({
        id: c.id,
        title: c.title,
        trainer: c.trainer,
        image: c.image || '/course-english.jpg',
        progress: 0,
        totalLessons: c.lessons_count || 12,
        completedLessons: 0,
        category: c.category,
        lastActive: 'New Enrollment',
      }));
      setCourses(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesTab = activeTab === 'completed' ? course.progress === 100 : course.progress < 100;
    const matchesQuery = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">My Courses</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage and track your active and completed courses</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full sm:w-[260px] shadow-soft">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-gray-150 gap-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'active'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Active Courses ({courses.filter(c => c.progress < 100).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'completed'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Completed ({courses.filter(c => c.progress === 100).length})
        </button>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-soft">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-gray-700">No courses found</h3>
          <p className="text-xs text-gray-400 mt-1">Try resetting your search query or browse our course catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 group flex flex-col h-full"
            >
              {/* Course Thumbnail */}
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden flex items-center justify-center">
                {/* Fallback image background gradients */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20" />
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/30 transition-colors duration-300" />
                
                {/* Floating Category Tag */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[10px] font-bold text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {course.category}
                </span>

                {/* Overlaid Play/Badge Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {course.progress === 100 ? (
                    <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Course details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <span>Trainer: {course.trainer}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Active {course.lastActive}
                    </span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        course.progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-400">
                    {course.completedLessons}/{course.totalLessons} Lessons
                  </span>
                  
                  {course.progress === 100 ? (
                    <button className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors">
                      <Award className="h-4 w-4" />
                      View Certificate
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-1 text-primary hover:text-primary-600 transition-all group-hover:translate-x-0.5">
                      Continue Learning
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
