'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, 
  Pause,
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Download, 
  MessageSquare, 
  Award, 
  ArrowLeft, 
  Video, 
  Volume2, 
  Maximize2, 
  Settings,
  HelpCircle,
  FileText,
  User,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  video_url: string;
  duration: number;
  is_preview: boolean;
  order_index: number;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lessons: Lesson[];
}

interface QAItem {
  id: string;
  user: string;
  role: string;
  text: string;
  time: string;
  replies: Array<{ user: string; role: string; text: string; time: string }>;
}

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'materials' | 'qa'>('about');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Mock Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoInterval = useRef<NodeJS.Timeout | null>(null);

  // Q&A States
  const [qaList, setQaList] = useState<QAItem[]>([
    {
      id: 'q1',
      user: 'Rahul Kapoor',
      role: 'Student',
      text: 'For the Present Perfect tense, can we use time expressions like "yesterday" or "last week"?',
      time: '2 hours ago',
      replies: [
        {
          user: 'Sarah Jenkins',
          role: 'Trainer',
          text: 'Great question Rahul! No, we cannot use specific past time markers with Present Perfect. Use Past Simple for that (e.g. "I went yesterday"). Present Perfect is for unspecified time (e.g. "I have gone there before").',
          time: '1 hour ago'
        }
      ]
    },
    {
      id: 'q2',
      user: 'Neha Sharma',
      role: 'Student',
      text: 'Is there a difference in pronunciation of "have" in fast spoken English?',
      time: '1 day ago',
      replies: []
    }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Fetch Course details, syllabus modules and completed ticks
  useEffect(() => {
    async function loadCoursePlayer() {
      if (!user || !courseId) return;
      try {
        // Fetch course details
        const coursesList = await db.getCourses();
        const activeCourse = coursesList.find((c: any) => c.id === courseId);
        
        if (!activeCourse) {
          console.error(`Course ${courseId} not found`);
          router.push('/student/courses');
          return;
        }
        
        setCourse(activeCourse);

        // Fetch modules with nested lessons
        const syllabus = await db.getCourseModulesAndLessons(courseId);
        setModules(syllabus);

        // Expand first module by default
        if (syllabus.length > 0) {
          setExpandedModules({ [syllabus[0].id]: true });
        }

        // Fetch completed lesson IDs
        const completed = await db.getCompletedLessons(user.id, courseId);
        setCompletedLessons(completed);

        // Set initial active lesson (first uncompleted, or first lesson overall)
        let initialLesson: Lesson | null = null;
        if (syllabus.length > 0) {
          // Find first uncompleted lesson
          for (const mod of syllabus) {
            const uncompleted = mod.lessons.find((l: Lesson) => !completed.includes(l.id));
            if (uncompleted) {
              initialLesson = uncompleted;
              break;
            }
          }
          // If all completed, select the very first lesson
          if (!initialLesson && syllabus[0].lessons.length > 0) {
            initialLesson = syllabus[0].lessons[0];
          }
        }
        setCurrentLesson(initialLesson);
        
      } catch (err) {
        console.error('Failed to load course player data', err);
      } finally {
        setLoading(false);
      }
    }
    loadCoursePlayer();
  }, [user, courseId]);

  // Video playback simulation hook
  useEffect(() => {
    if (isPlaying) {
      const simulatedTotalSeconds = (currentLesson?.duration || 10) * 60;
      videoInterval.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 10; // Speed up video progress in dev to feel dynamic
          if (next >= simulatedTotalSeconds) {
            // Video finished
            setIsPlaying(false);
            if (videoInterval.current) clearInterval(videoInterval.current);
            handleVideoEnd();
            return simulatedTotalSeconds;
          }
          setVideoProgress((next / simulatedTotalSeconds) * 100);
          return next;
        });
      }, 1000);
    } else {
      if (videoInterval.current) clearInterval(videoInterval.current);
    }

    return () => {
      if (videoInterval.current) clearInterval(videoInterval.current);
    };
  }, [isPlaying, currentLesson]);

  // Handle lesson change
  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoProgress(0);
    
    // Automatically expand the module containing the lesson
    setExpandedModules(prev => ({
      ...prev,
      [lesson.module_id]: true
    }));
  };

  // Video finished - auto complete lesson
  const handleVideoEnd = async () => {
    if (!user || !course || !currentLesson) return;
    
    const isAlreadyCompleted = completedLessons.includes(currentLesson.id);
    if (!isAlreadyCompleted) {
      console.log(`Video ended. Automatically marking lesson as complete: ${currentLesson.title}`);
      await toggleLessonCheck(currentLesson.id, true);
    }
  };

  // Toggle lesson complete check
  const toggleLessonCheck = async (lessonId: string, completed: boolean) => {
    if (!user || !course) return;
    
    const lesson = modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
    if (!lesson) return;

    try {
      // Optimitic local update
      if (completed) {
        setCompletedLessons(prev => [...prev, lessonId]);
      } else {
        setCompletedLessons(prev => prev.filter(id => id !== lessonId));
      }

      const success = await db.toggleLessonProgress(
        user.id,
        courseId,
        lessonId,
        completed,
        lesson.title
      );

      if (!success) {
        // Rollback on failure
        if (completed) {
          setCompletedLessons(prev => prev.filter(id => id !== lessonId));
        } else {
          setCompletedLessons(prev => [...prev, lessonId]);
        }
      } else {
        // Re-fetch course stats/progress in database
        const coursesList = await db.getEnrolledCourses(user.id);
        const updatedCourse = coursesList.find((c: any) => c.id === courseId);
        if (updatedCourse) {
          setCourse((prev: any) => ({
            ...prev,
            progress: updatedCourse.progress,
            completedLessons: updatedCourse.completedLessons
          }));
        }
      }
    } catch (err) {
      console.error('Failed to toggle lesson progress:', err);
    }
  };

  // Toggle module accordion expand
  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Add Question Forum Q&A
  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !user) return;

    const newItem: QAItem = {
      id: `q-${Date.now()}`,
      user: user.name || user.email.split('@')[0],
      role: 'Student',
      text: newQuestion.trim(),
      time: 'Just now',
      replies: []
    };

    setQaList(prev => [newItem, ...prev]);
    setNewQuestion('');
  };

  // Format time (seconds to MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12 text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-xs font-semibold">Loading lesson player...</p>
      </div>
    );
  }

  // Calculate course syllabus progress percentage
  const totalCourseLessonsCount = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const currentProgressPercent = totalCourseLessonsCount > 0 
    ? Math.round((completedLessons.length / totalCourseLessonsCount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header bar with Back button and progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-100 rounded-3xl p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <Link 
            href="/student/courses" 
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold text-gray-800 tracking-tight leading-snug">{course?.title}</h1>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 w-full md:w-auto max-w-xs md:max-w-none">
          <div className="flex-1 md:w-[160px] space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Course Progress</span>
              <span>{currentProgressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500" 
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-center bg-primary-50 px-3.5 py-2.5 rounded-2xl shrink-0">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-xs font-extrabold text-primary">
              {completedLessons.length}/{totalCourseLessonsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Player & Metadata Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Custom Video Player Mock */}
          <div className="relative aspect-video bg-gray-950 rounded-3xl overflow-hidden shadow-lg border border-gray-900 group">
            {/* Mock Video Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* If not playing, show course/lesson theme background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-950 via-gray-950 to-secondary-950 opacity-80" />
              
              {/* Play symbol center button when paused */}
              {!isPlaying && (
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="z-10 h-16 w-16 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-600 transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer"
                >
                  <Play className="h-6 w-6 fill-current ml-1" />
                </button>
              )}

              {/* simulated screen visualization */}
              {isPlaying && (
                <div className="z-0 animate-pulse text-center space-y-3">
                  <Video className="h-12 w-12 text-primary-300 mx-auto opacity-30" />
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Simulating Lesson Video Playback...</p>
                  <p className="text-sm font-bold text-gray-100">{currentLesson?.title}</p>
                </div>
              )}

              {/* Watermark Logo */}
              <span className="absolute top-4 left-4 text-xs font-extrabold text-white/20 tracking-wider">
                TESCA Spoken English
              </span>
            </div>

            {/* Custom Control Bar overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity flex flex-col gap-3">
              {/* Video Timeline Bar */}
              <div 
                className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group-hover:h-1.5 transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  const total = (currentLesson?.duration || 10) * 60;
                  setCurrentTime(ratio * total);
                  setVideoProgress(ratio * 100);
                }}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all" 
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white text-xs font-semibold">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 text-white hover:text-primary transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>

                  {/* Audio Volume */}
                  <div className="flex items-center gap-1">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-12 h-1 accent-primary rounded-full appearance-none bg-white/20"
                    />
                  </div>

                  {/* Time Indicator */}
                  <span className="text-gray-300 select-none">
                    {formatTime(currentTime)} / {formatTime((currentLesson?.duration || 10) * 60)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mark complete manually */}
                  <button 
                    onClick={() => currentLesson && toggleLessonCheck(currentLesson.id, !completedLessons.includes(currentLesson.id))}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider transition-all cursor-pointer ${
                      completedLessons.includes(currentLesson?.id || '')
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {completedLessons.includes(currentLesson?.id || '') ? 'Completed ✓' : 'Mark Completed'}
                  </button>

                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Content Tabs */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-gray-150 gap-6">
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all relative ${
                  activeTab === 'about'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  About This Lesson
                </span>
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all relative ${
                  activeTab === 'materials'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Worksheets & Study Material
                </span>
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                className={`pb-3 text-sm font-bold border-b-2 transition-all relative ${
                  activeTab === 'qa'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  Lesson Q&A Forum
                </span>
              </button>
            </div>

            {/* Tab Panes */}
            {activeTab === 'about' && (
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <div>
                  <h3 className="text-base font-bold text-gray-800">{currentLesson?.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Lesson {currentLesson?.order_index} • Duration: {currentLesson?.duration} mins</p>
                </div>
                
                <p>
                  In this lesson, you will master the concepts, vocabulary, and conversational structures designed to improve your fluency.
                  Make sure to watch the simulated video instructions carefully, pay close attention to sentence structures, and download the workbook exercises from the worksheets tab.
                </p>

                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100/40">
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-2">Lesson Learning Objectives:</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-primary-950 font-medium">
                    <li>Understand context-specific grammar rules.</li>
                    <li>Recognize correct pronunciation and accent inflection points.</li>
                    <li>Complete the interactive vocabulary worksheet.</li>
                    <li>Apply sentences in daily conversation practice.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Downloadable Worksheets</h3>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">2 resources available</span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Idioms and Grammar Exercise Sheet - Lesson 1.pdf', size: '1.2 MB', category: 'Grammar Work' },
                    { name: 'Vocabulary Guide & Conversations Script.pdf', size: '940 KB', category: 'Dialogue Guide' }
                  ].map((doc, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:bg-gray-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{doc.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{doc.category} • {doc.size}</p>
                        </div>
                      </div>
                      <button className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-150 text-gray-400 hover:text-primary hover:border-primary hover:bg-white transition-all cursor-pointer">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="space-y-6">
                <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Classroom Discussion</h3>
                
                {/* Ask Question Form */}
                <form onSubmit={handlePostQuestion} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-100 text-primary font-bold flex items-center justify-center uppercase shrink-0 text-xs shadow-soft">
                    {user?.name?.substring(0, 2) || 'ST'}
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea 
                      placeholder="Ask a question about this lesson..."
                      rows={2}
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="w-full text-xs text-gray-700 placeholder:text-gray-400 border border-gray-150 rounded-2xl p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="btn-primary text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-xl cursor-pointer"
                        style={{ background: 'var(--color-primary)' }}
                      >
                        Ask Instructor
                      </button>
                    </div>
                  </div>
                </form>

                {/* Q&A Thread List */}
                <div className="space-y-4">
                  {qaList.map((qa) => (
                    <div key={qa.id} className="border-t border-gray-100 pt-4 space-y-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 font-bold text-[11px] flex items-center justify-center uppercase shrink-0">
                          {qa.user.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-800">{qa.user}</span>
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">{qa.role}</span>
                            <span className="text-[10px] text-gray-400 font-semibold">{qa.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{qa.text}</p>
                        </div>
                      </div>

                      {/* Instructor Replies */}
                      {qa.replies.map((reply, idx) => (
                        <div key={idx} className="bg-gray-50/70 border border-gray-100/40 rounded-2xl p-4 ml-10 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-secondary-100 text-secondary font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
                              {reply.user.substring(0, 2)}
                            </div>
                            <span className="text-xs font-bold text-gray-800">{reply.user}</span>
                            <span className="text-[9px] bg-secondary-100 text-secondary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{reply.role}</span>
                            <span className="text-[10px] text-gray-400 font-semibold">{reply.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Syllabus Accordion */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-soft h-fit space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Course Modules</h2>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wide">Select a lesson to begin learning</p>
          </div>

          <div className="space-y-3">
            {modules.map((mod) => {
              const isExpanded = !!expandedModules[mod.id];
              const completedCount = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
              
              return (
                <div key={mod.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                  {/* Module Header Button */}
                  <button
                    onClick={() => toggleModuleExpand(mod.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50/60 hover:bg-gray-50 transition-all text-left outline-none cursor-pointer"
                  >
                    <div className="space-y-1 pr-2">
                      <span className="text-xs font-bold text-gray-800 leading-snug">{mod.title}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <span>{completedCount}/{mod.lessons.length} Completed</span>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </button>

                  {/* Lessons List inside Module */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-white">
                      {mod.lessons.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">No lessons available in this module</div>
                      ) : (
                        <div className="divide-y divide-gray-50">
                          {mod.lessons.map((les) => {
                            const isCompleted = completedLessons.includes(les.id);
                            const isActive = currentLesson?.id === les.id;
                            
                            return (
                              <div 
                                key={les.id}
                                className={`flex items-center justify-between p-3.5 pl-4 transition-all ${
                                  isActive 
                                    ? 'bg-primary-50/40 border-l-4 border-primary pl-3' 
                                    : 'hover:bg-gray-50/40'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {/* Checkbox to toggle completed */}
                                  <button
                                    onClick={() => toggleLessonCheck(les.id, !isCompleted)}
                                    className="focus:outline-none shrink-0 cursor-pointer"
                                  >
                                    <CheckCircle 
                                      className={`h-4 w-4 transition-colors ${
                                        isCompleted ? 'text-emerald-500 fill-emerald-50' : 'text-gray-300 hover:text-gray-400'
                                      }`} 
                                    />
                                  </button>

                                  {/* Lesson play trigger */}
                                  <button
                                    onClick={() => selectLesson(les)}
                                    className="text-left min-w-0 flex-1 outline-none cursor-pointer"
                                  >
                                    <p className={`text-xs truncate ${isActive ? 'font-bold text-primary' : 'font-medium text-gray-600'}`}>
                                      {les.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">
                                      <Clock className="h-2.5 w-2.5" />
                                      <span>{les.duration} mins</span>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
