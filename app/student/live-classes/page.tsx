'use client';

import { useState, useEffect } from 'react';
import { Calendar, Video, Clock, User, ArrowUpRight, Play, AlertCircle } from 'lucide-react';
import { db } from '@/lib/db';

interface LiveClass {
  id: string;
  topic: string;
  trainer: string;
  dateTime: string;
  duration: string;
  status: 'live' | 'upcoming' | 'completed';
  joinUrl?: string;
}

export default function StudentLiveClassesPage() {
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getLiveClasses();
      const mapped = data.map((lc: any) => ({
        id: lc.id,
        topic: lc.topic,
        trainer: lc.trainer,
        dateTime: lc.date_time,
        duration: lc.duration,
        status: db.computeStatus(lc.date_time, lc.duration),
        joinUrl: lc.join_url,
      }));
      setLiveClasses(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const filteredClasses = liveClasses.filter((lc) => {
    if (activeFilter === 'upcoming') {
      return lc.status === 'live' || lc.status === 'upcoming';
    }
    return lc.status === 'completed';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Live Classes</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Attend daily interactive sessions and access recordings</p>
      </div>

      {/* Warning / Important Info banner */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex gap-3 text-primary text-xs leading-normal">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold">Live Class Guidelines:</p>
          <ul className="list-disc list-inside space-y-0.5 text-primary-600 font-medium">
            <li>Ensure a stable internet connection and quiet environment.</li>
            <li>Please join 5 minutes before the scheduled time.</li>
            <li>Keep your microphone muted unless prompted by the trainer.</li>
          </ul>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-gray-150 gap-6">
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeFilter === 'upcoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Upcoming & Live Classes ({liveClasses.filter(c => c.status !== 'completed').length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeFilter === 'completed'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Recorded Sessions ({liveClasses.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-soft">
            <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-gray-700">No classes found</h3>
            <p className="text-xs text-gray-400 mt-1">There are no sessions scheduled under this filter right now.</p>
          </div>
        ) : (
          filteredClasses.map((lc) => {
            const isLive = lc.status === 'live';
            return (
              <div
                key={lc.id}
                className={`bg-white border rounded-2xl p-5 shadow-soft transition-all duration-300 hover:shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                  isLive ? 'border-secondary/30 ring-2 ring-secondary/5' : 'border-gray-100/80'
                }`}
              >
                {/* Topic and Trainer */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {isLive && (
                      <span className="inline-flex items-center gap-1 bg-secondary text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Live Now
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                      <User className="h-3.5 w-3.5" />
                      {lc.trainer}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-800 tracking-tight leading-snug">
                    {lc.topic}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {lc.dateTime}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {lc.duration}
                    </span>
                  </div>
                </div>

                {/* Right Side: CTA buttons */}
                <div className="w-full md:w-auto flex-shrink-0">
                  {isLive ? (
                    <a
                      href={lc.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-secondary text-white text-xs font-bold shadow-warm hover:bg-secondary-600 transition-all duration-300"
                    >
                      Join Google Meet
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : lc.status === 'upcoming' ? (
                    lc.joinUrl ? (
                      <a
                        href={lc.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold shadow-soft transition-all duration-300"
                      >
                        Join Live Class
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
                      >
                        Class Scheduled
                      </button>
                    )
                  ) : (
                    <span className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 text-xs font-bold">
                      <Play className="h-3.5 w-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
