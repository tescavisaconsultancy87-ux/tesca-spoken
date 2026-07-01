'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, Calendar, ArrowRight, Play, Video, FileText } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressRing from '@/components/dashboard/ProgressRing';
import ActivityList from '@/components/dashboard/ActivityList';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';

export default function StudentDashboardHome() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cData, lData, bData] = await Promise.all([
          db.getCourses(),
          db.getLiveClasses(),
          db.getBatches()
        ]);
        setCourses(cData || []);

        // Find if student belongs to a batch
        const myBatch = (bData || []).find((b: any) => {
          const studentIds = Array.isArray(b.student_ids)
            ? b.student_ids
            : typeof b.student_ids === 'string'
            ? JSON.parse(b.student_ids)
            : [];
          return studentIds.includes(user?.id);
        });
        const myBatchId = myBatch?.id;

        // Filter: show only if class has no batch_id, or if batch_id matches student's batch
        const filteredLive = (lData || []).filter((lc: any) => !lc.batch_id || lc.batch_id === myBatchId);

        setLiveClasses(filteredLive);
      } catch (err) {
        console.error('Failed to load student home data', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadData();
    }
  }, [user]);

  // Find next class from liveClasses
  const nextClass = liveClasses.find((lc) => {
    const st = db.computeStatus(lc.date_time, lc.duration);
    return st === 'live' || st === 'upcoming';
  });

  const currentCourse = courses[0];

  const enrolledCount = courses.length;


  return (
    <div className="space-y-6">
      {/* Header welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-600 rounded-3xl p-6 sm:p-8 text-white shadow-soft">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-2">

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-sm text-primary-100 font-medium">
            You're making amazing progress. {nextClass ? `Your next class "${nextClass.topic}" is scheduled soon!` : 'No live classes scheduled for today. Keep it up!'}
          </p>
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Enrolled Courses"
          value={String(enrolledCount)}
          trend={enrolledCount > 0 ? { value: enrolledCount, isPositive: true } : undefined}
          description={enrolledCount > 0 ? 'active enrollments' : 'browse catalog'}
          icon={BookOpen}
          color="primary"
        />
        <StatCard
          label="Live Classes"
          value={String(liveClasses.length)}
          trend={liveClasses.length > 0 ? { value: liveClasses.length, isPositive: true } : undefined}
          description={liveClasses.length > 0 ? 'total sessions' : 'no sessions yet'}
          icon={Clock}
          color="secondary"
        />

        <StatCard
          label="Next Live Class"
          value={nextClass ? (nextClass.status === 'live' ? 'Live Now' : 'Scheduled') : 'No Classes'}
          description={nextClass ? `${nextClass.topic.substring(0, 24)}${nextClass.topic.length > 24 ? '...' : ''}` : 'Check back later'}
          icon={Calendar}
          color="accent"
        />
      </div>

      {/* Main sections layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle: Chart and Current Course Card */}
        <div className="lg:col-span-2 space-y-6">


          {/* Current Course Spotlight */}
          {currentCourse ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft flex flex-col md:flex-row items-center gap-6">
              <div className="relative h-28 w-28 rounded-2xl bg-secondary-50 flex items-center justify-center flex-shrink-0">
                <Play className="h-10 w-10 text-secondary fill-current" />
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <span className="text-[10px] font-bold text-secondary bg-secondary-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  In Progress
                </span>
                <h3 className="text-lg font-bold text-gray-800">{currentCourse.title}</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Active Course
                </p>
                
                {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Progress</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '0%' }} />
                    </div>
                  </div>
              </div>
              <Link
                href="/student/courses"
                className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary-600 transition-all duration-300 hover:shadow-soft"
              >
                Resume Lesson
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-soft text-center space-y-3 flex flex-col items-center justify-center min-h-[160px]">
              <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">No Enrolled Courses</h3>
                <p className="text-xs text-gray-400 max-w-sm">You are not enrolled in any courses yet. Once you enroll, your active courses will appear here.</p>
              </div>
            </div>
          )}

          {/* Quick Access to Live Classes and Study Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <Link href="/student/live-classes" className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center gap-5 cursor-pointer">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Live Classes</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">Join scheduled interactive sessions with your trainer.</p>
              </div>
            </Link>

            <Link href="/student/materials" className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center gap-5 cursor-pointer">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Study Materials</h3>
                <p className="text-xs text-gray-400 font-medium mt-1">Access PDFs, worksheets, and course resources.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right side: Progress Ring & Recent Activities */}
        <div className="space-y-6">
          {/* Target completion progress ring */}
          <div className="grid grid-cols-2 gap-4">
            <ProgressRing
              title="Courses"
              percentage={Math.min(Math.round((enrolledCount / Math.max(enrolledCount, 1)) * 100), 100)}
              subtitle="Enrolled"
              color="primary"
            />
            <ProgressRing
              title="Classes"
              percentage={liveClasses.filter((lc) => db.computeStatus(lc.date_time, lc.duration) === 'completed').length > 0 ? 100 : 0}
              subtitle="Completed"
              color="secondary"
            />
          </div>

          {/* Activity list — no activity tracking yet */}
          <ActivityList title="Recent Activity" activities={[]} />
        </div>
      </div>
    </div>
  );
}
