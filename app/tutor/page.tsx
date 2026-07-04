'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, ArrowRight, Calendar, User, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import { db } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';

export default function TutorDashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    coursesCount: 0,
    liveClassesCount: 0,
    materialsCount: 0,
    upcomingClassesCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentMaterials, setRecentMaterials] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const coursesList = await db.getCourses();
        const liveList = await db.getLiveClasses();
        const materialsList = await db.getStudyMaterials();

        const upcoming = liveList.filter((lc: any) => {
          const status = db.computeStatus(lc.date_time, lc.duration);
          return status === 'upcoming' || status === 'live';
        });

        setStats({
          coursesCount: coursesList.length,
          liveClassesCount: liveList.length,
          materialsCount: materialsList.length,
          upcomingClassesCount: upcoming.length
        });

        setUpcomingClasses(upcoming.slice(0, 3));
        setRecentMaterials(materialsList.slice(0, 3));
      } catch (err) {
        console.error('Failed to load tutor overview stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3 animate-pulse">Loading Instructor Overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-scale-up">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Instructor Overview
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            Welcome back, {user?.name || 'Tutor'}! Manage your courses, classes, and materials.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white border border-gray-150 rounded-xl px-4 py-2.5 shadow-soft self-start md:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Instructor Status: Active & Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Total Courses"
          value={loading ? '...' : stats.coursesCount.toLocaleString()}
          trend={{ value: 0, isPositive: true }}
          description="active programs"
          icon={BookOpen}
          color="primary"
        />
        <StatCard
          label="Live Classes"
          value={loading ? '...' : stats.liveClassesCount.toLocaleString()}
          trend={{ value: 0, isPositive: true }}
          description="total sessions"
          icon={Video}
          color="secondary"
        />
        <StatCard
          label="Study Materials"
          value={loading ? '...' : stats.materialsCount.toLocaleString()}
          trend={{ value: 0, isPositive: true }}
          description="uploaded files"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          label="Active / Upcoming"
          value={loading ? '...' : stats.upcomingClassesCount.toLocaleString()}
          trend={{ value: 0, isPositive: true }}
          description="sessions scheduled"
          icon={Calendar}
          color="accent"
        />
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link href="/tutor/courses" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Courses</h3>
              <p className="text-[10px] text-gray-400 font-medium">Add & Edit Curriculums</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/tutor/live-classes" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition-colors">Live Classes</h3>
              <p className="text-[10px] text-gray-400 font-medium">Schedule Meet Sessions</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/tutor/materials" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Materials</h3>
              <p className="text-[10px] text-gray-400 font-medium">Upload PDF & Audio Resources</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Live Classes Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-855 flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              Upcoming Scheduled Sessions
            </h3>
            <Link href="/tutor/live-classes" className="text-[10px] font-bold text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <p className="text-xs text-gray-400 py-4">Loading classes...</p>
            ) : upcomingClasses.length === 0 ? (
              <p className="text-xs text-gray-450 py-4">No upcoming classes scheduled.</p>
            ) : (
              upcomingClasses.map((lc) => (
                <div key={lc.id} className="py-3 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-800">{lc.topic}</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-semibold">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {lc.trainer}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lc.duration}</span>
                    </div>
                  </div>
                  {(() => {
                    const st = db.computeStatus(lc.date_time, lc.duration);
                    return (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        st === 'live' ? 'bg-secondary text-white animate-pulse' : 'bg-primary-50 text-primary'
                      }`}>
                        {st}
                      </span>
                    );
                  })()}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Uploaded Materials Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-855 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              Recently Uploaded Resources
            </h3>
            <Link href="/tutor/materials" className="text-[10px] font-bold text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <p className="text-xs text-gray-400 py-4">Loading resources...</p>
            ) : recentMaterials.length === 0 ? (
              <p className="text-xs text-gray-450 py-4">No study materials uploaded yet.</p>
            ) : (
              recentMaterials.map((mat) => (
                <div key={mat.id} className="py-3 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-850 truncate max-w-[240px]">{mat.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      Category: <span className="capitalize">{mat.category}</span> • Added: {mat.added_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {mat.format}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {mat.size}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
